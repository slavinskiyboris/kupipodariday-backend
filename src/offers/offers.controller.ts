import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { WishesService } from '../wishes/wishes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MailerService } from '../mailer/mailer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/user.entity';
import { Wish } from '../wishes/wish.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Offer } from './offer.entity';

@ApiTags('offers')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(
    private readonly offerService: OffersService,
    private readonly wishService: WishesService,
    private readonly mailService: MailerService,
  ) {}

  @ApiOperation({ summary: 'Создание предложения о вкладе в подарок' })
  @ApiResponse({
    status: 201,
    description: 'Предложение успешно создано',
    type: Offer,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({
    status: 403,
    description: 'Нельзя скидываться на собственные подарки',
  })
  @ApiResponse({
    status: 409,
    description: 'Сумма превышает стоимость подарка',
  })
  @Post()
  async submitContribution(
    @Body() contributionData: CreateOfferDto,
    @Request() req,
  ) {
    const targetWish = await this.wishService.getWishById({
      where: { id: contributionData.item },
    });

    if (targetWish.owner.id === req.user.userId) {
      throw new ForbiddenException('You cannot fund your own wishes');
    }

    const updatedAmount = targetWish.raised + contributionData.amount;
    if (updatedAmount > targetWish.price) {
      throw new ConflictException(
        'The total amount of contributions exceeds the price of the wish',
      );
    }

    const offerData = {
      amount: contributionData.amount,
      hidden: contributionData.hidden,
      user: { id: req.user.userId } as User,
      item: { id: contributionData.item } as Wish,
    };

    const savedContribution = await this.offerService.create(offerData);

    // Send email to the wish owner
    await this.mailService.sendMail({
      to: targetWish.owner.email,
      subject: 'New contribution to your wish',
      text: `User ${req.user.username} has contributed ${contributionData.amount} to your wish "${targetWish.name}".`,
    });

    // Update the raised amount
    await this.wishService.modifyWish(targetWish.id, { raised: updatedAmount });

    return savedContribution;
  }
}
