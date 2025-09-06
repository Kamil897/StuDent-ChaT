import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('add')
  async addFriend(
    @Req() req: Request & { user: { id: number } },
    @Body() body: { friendId: number }
  ) {
    return this.friendsService.addFriend(req.user.id, body.friendId);
  }

  @Post('accept')
  async acceptFriendRequest(
    @Req() req: Request & { user: { id: number } },
    @Body() body: { friendId: number }
  ) {
    return this.friendsService.acceptFriendRequest(req.user.id, body.friendId);
  }

  @Get(':id')
  async getFriends(@Param('id') id: string) {
    return this.friendsService.getFriends(Number(id));
  }

  @Get()
  async getCurrentUserFriends(@Req() req: Request & { user: { id: number } }) {
    return this.friendsService.getFriends(req.user.id);
  }

  @Get('pending/requests')
  async getPendingRequests(@Req() req: Request & { user: { id: number } }) {
    return this.friendsService.getPendingRequests(req.user.id);
  }

  @Post('remove')
  async removeFriend(
    @Req() req: Request & { user: { id: number } },
    @Body() body: { friendId: number }
  ) {
    return this.friendsService.removeFriend(req.user.id, body.friendId);
  }

  @Post('block')
  async blockUser(
    @Req() req: Request & { user: { id: number } },
    @Body() body: { friendId: number }
  ) {
    return this.friendsService.blockUser(req.user.id, body.friendId);
  }
}




