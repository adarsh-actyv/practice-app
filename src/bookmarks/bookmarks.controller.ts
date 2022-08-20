import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Controller('bookmarks')
@UseGuards(JwtGuard)
export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {}

  @Post('create-bookmark')
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.createBookmark(userId, dto);
  }

  @Get('get-all-bookmarks')
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarksService.getBookmarks(userId);
  }

  @Get('/get-bookmark/:id')
  getBookmarksById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarksService.getBookmarksById(userId, bookmarkId);
  }

  @Patch('edit-bookmark/:id')
  editBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarksService.editBookmarkById(userId, bookmarkId, dto);
  }

  @Delete('/delete-bookmark/:id')
  deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarksService.deleteBookmarkById(userId, bookmarkId);
  }
}
