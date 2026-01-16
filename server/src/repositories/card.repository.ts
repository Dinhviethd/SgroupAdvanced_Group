import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { Card } from '@/models/card.model';
import { List } from '@/models/list.model';
import { BoardUser } from '@/models/board_user.model';
import { Role } from '@/models/role.model';

export class CardRepository {
  private repository: Repository<Card>;
  private listRepository: Repository<List>;
  private boardUserRepository: Repository<BoardUser>;
  private roleRepository: Repository<Role>;

  constructor() {
    this.repository = AppDataSource.getRepository(Card);
    this.listRepository = AppDataSource.getRepository(List);
    this.boardUserRepository = AppDataSource.getRepository(BoardUser);
    this.roleRepository = AppDataSource.getRepository(Role);
  }

  async findById(idCard: number): Promise<Card | null> {
    return this.repository.findOne({
      where: { idCard },
      relations: ['list', 'list.board', 'createdBy', 'labels'],
    });
  }

  async findByListId(listId: number): Promise<Card[]> {
    return this.repository.find({
      where: { 
        list: { idList: listId },
        isArchived: false,
      },
      relations: ['list', 'createdBy', 'labels'],
      order: { position: 'ASC' },
    });
  }

  async findByBoardId(boardId: number): Promise<Card[]> {
    return this.repository.find({
      where: { 
        list: { board: { idBoard: boardId } },
        isArchived: false,
      },
      relations: ['list', 'createdBy', 'labels'],
      order: { position: 'ASC' },
    });
  }

  async getNextPosition(listId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('card')
      .where('card.idList = :listId', { listId })
      .andWhere('card.isArchived = false')
      .select('MAX(card.position)', 'maxPosition')
      .getRawOne();
    
    return (result?.maxPosition ?? -1) + 1;
  }

  async create(cardData: Partial<Card>): Promise<Card> {
    const card = this.repository.create(cardData);
    return this.repository.save(card);
  }

  async update(idCard: number, updateData: Partial<Card>): Promise<Card | null> {
    await this.repository.update(idCard, updateData);
    return this.findById(idCard);
  }

  async delete(idCard: number): Promise<boolean> {
    const result = await this.repository.delete(idCard);
    return result.affected !== 0;
  }

  async archive(idCard: number): Promise<boolean> {
    const result = await this.repository.update(idCard, { isArchived: true });
    return result.affected !== 0;
  }

  async unarchive(idCard: number): Promise<boolean> {
    const result = await this.repository.update(idCard, { isArchived: false });
    return result.affected !== 0;
  }

  async getListById(listId: number): Promise<List | null> {
    return this.listRepository.findOne({
      where: { idList: listId },
      relations: ['board'],
    });
  }

  async isUserInBoard(userId: number, boardId: number): Promise<boolean> {
    const count = await this.boardUserRepository.count({
      where: { user: { idUser: userId }, board: { idBoard: boardId } },
    });
    return count > 0;
  }

  async getUserBoardRole(userId: number, boardId: number): Promise<Role | null> {
    const boardUser = await this.boardUserRepository.findOne({
      where: { user: { idUser: userId }, board: { idBoard: boardId } },
      relations: ['role', 'role.permissions'],
    });
    return boardUser?.role || null;
  }

  async userHasPermission(userId: number, boardId: number, permissionCode: string): Promise<boolean> {
    const role = await this.getUserBoardRole(userId, boardId);
    if (!role || !role.permissions) return false;
    return role.permissions.some(p => p.code === permissionCode);
  }

  async moveCard(cardId: number, newListId: number, newPosition: number): Promise<Card | null> {
    await this.repository.update(cardId, {
      list: { idList: newListId } as any,
      position: newPosition,
    });
    return this.findById(cardId);
  }
  async updatePositions(listId: number, cards: { idCard: number; position: number }[]): Promise<void> {
    for (const card of cards) {
      await this.repository.update(card.idCard, { position: card.position });
    }
  }
}

export const cardRepository = new CardRepository();
