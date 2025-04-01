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

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offerService: OffersService,
    private readonly wishService: WishesService,
    private readonly mailService: MailerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async submitContribution(@Body() contributionData, @Request() req) {
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

    contributionData.user = req.user.userId;

    const savedContribution = await this.offerService.create(contributionData);

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
