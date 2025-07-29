import { IUser } from '../types';

// 인메모리 스토리지
class InMemoryStorage {
  private users: Map<string, IUser> = new Map();
  private posts: Map<string, any> = new Map();
  private comments: Map<string, any> = new Map();
  private reactions: Map<string, any> = new Map();
  private chatRooms: Map<string, any> = new Map();
  private chatMessages: Map<string, any> = new Map();

  // User operations
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const id = Date.now().toString();
    const user: IUser = {
      _id: id,
      email: userData.email || '',
      name: userData.name || '',
      password: userData.password || '',
      type: userData.type || 'mentee',
      avatar: userData.avatar,
      teacherType: userData.teacherType,
      yearsOfExperience: userData.yearsOfExperience,
      isVerified: userData.isVerified || false,
      refreshToken: userData.refreshToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IUser;

    this.users.set(id, user);
    return user;
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id: string): Promise<IUser | null> {
    return this.users.get(id) || null;
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updateData, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Post operations
  async createPost(postData: any): Promise<any> {
    const id = Date.now().toString();
    const post = {
      _id: id,
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async findPosts(query: any = {}): Promise<any[]> {
    return Array.from(this.posts.values());
  }

  async findPostById(id: string): Promise<any | null> {
    return this.posts.get(id) || null;
  }

  // Comment operations
  async createComment(commentData: any): Promise<any> {
    const id = Date.now().toString();
    const comment = {
      _id: id,
      ...commentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async findCommentsByPostId(postId: string): Promise<any[]> {
    return Array.from(this.comments.values()).filter(comment => comment.postId === postId);
  }

  // Reaction operations
  async createReaction(reactionData: any): Promise<any> {
    const id = Date.now().toString();
    const reaction = {
      _id: id,
      ...reactionData,
      createdAt: new Date(),
    };
    this.reactions.set(id, reaction);
    return reaction;
  }

  async findReactionsByPostId(postId: string): Promise<any[]> {
    return Array.from(this.reactions.values()).filter(reaction => reaction.postId === postId);
  }

  // Chat operations
  async createChatRoom(roomData: any): Promise<any> {
    const id = Date.now().toString();
    const room = {
      _id: id,
      ...roomData,
      createdAt: new Date(),
    };
    this.chatRooms.set(id, room);
    return room;
  }

  async createChatMessage(messageData: any): Promise<any> {
    const id = Date.now().toString();
    const message = {
      _id: id,
      ...messageData,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async findChatMessagesByRoomId(roomId: string): Promise<any[]> {
    return Array.from(this.chatMessages.values()).filter(message => message.roomId === roomId);
  }
}

export const inMemoryStorage = new InMemoryStorage(); 