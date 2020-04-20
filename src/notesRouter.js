import {Router} from 'express';
import notesService from './NotesService';

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.json(await notesService.getAll(req.principal, req.query.page, req.query.limit));
  } catch (e) {
    res.end('ERROR');
  }
});

router.post('/', async (req, res) => {
  try {
    res.json(await notesService.create(req.principal, req.body));
  } catch (e) {
    res.end('ERROR');
  }
});

router.put('/:id', async (req, res) => {
  try {
    res.json(await notesService.update(req.principal, {
      ...req.body,
      id: req.params.id
    }));
  } catch (e) {
    res.end('ERROR');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await notesService.delete(req.principal, req.params.id);
    res.send('OK');
  } catch (e) {
    res.end('ERROR');
  }
});

export default router;
