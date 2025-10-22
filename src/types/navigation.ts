import { PostType } from './post';

export type RootStackParamList = {
  Home: undefined;
  PublishPost: { postToEdit?: PostType } | undefined;
  StudentPost: { postId: string };
};

