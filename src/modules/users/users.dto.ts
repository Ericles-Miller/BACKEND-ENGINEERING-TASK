

export type UserDto = {
  id?: string;
  name: string;
  createdAt: Date;
  avatar?: string;
  email: string;
};


export interface UserWithAvatar {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
  avatarContent?: string; // Adicione a propriedade avatarContent como opcional
}