import { AbilityBuilder, createMongoAbility } from '@casl/ability'
// import { User } from '../models'; // application specific interfaces
import { UserSelect } from '@/models/user.model';

/**
 * @param user contains details about logged in user: its id, name, email, etc
 */
export function defineAbilitiesFor(user: UserSelect) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  can('read', 'Folder', { authorId: user.id });
  can('create', 'Folder', { authorId: user.id });
  can('update', 'List', { authorId: user.id });
  can('delete', 'List', { authorId: user.id });

  can('read', 'List', { authorId: user.id });
  can('create', 'List', { authorId: user.id });
  can('update', 'List', { authorId: user.id });
  can('delete', 'List', { authorId: user.id });

  can('read', 'Task', { authorId: user.id });
  can('create', 'Task', { authorId: user.id });
  can('update', 'Task', { authorId: user.id });
  can('delete', 'Task', { authorId: user.id });


  return build();
};