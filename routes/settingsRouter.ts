import { updateSettings } from '../controllers/user.controller';
import { createRouter } from '../utils/createRouter';


export default createRouter((router, protectedRouter) => {
  protectedRouter.patch('/:id', updateSettings);
});



