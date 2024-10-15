import { AbilityBuilder, createMongoAbility } from '@casl/ability'
// import { User } from '../schema'; // application specific interfaces
import type { User } from '../schema/user.model';

/**
 * @param user contains details about logged in user: its id, name, email, etc
 */
export function defineAbilitiesFor(user: User) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  can('read', 'Folder', { authorId: user.id });
  can('create', 'Folder');
  can('update', 'List', { authorId: user.id });
  can('delete', 'List', { authorId: user.id });

  can('read', 'List', { authorId: user.id });
  can('create', 'List');
  can('update', 'List', { authorId: user.id });
  can('delete', 'List', { authorId: user.id });

  can('read', 'Task', { authorId: user.id });
  can('create', 'Task');
  can('update', 'Task', { authorId: user.id });
  can('delete', 'Task', { authorId: user.id });


  return build();
};