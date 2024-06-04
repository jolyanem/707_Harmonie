import express from 'express';
import { db } from '../db.js';
import type { UserDto } from '../types.js';
import { Statut } from '@prisma/client';
import { generateIdFromEntropySize } from 'lucia';

const usersRouter = express.Router();

usersRouter
  .use((req, res, next) => {
    if (res.locals.user?.role !== 'Collaborateur') {
      return res.status(403).json({
        message: '',
      });
    }
    return next();
  })
  .get('/', async (req, res) => {
    console.log('[GET] Users');
    const users = await db.user.findMany();
    res.json(users satisfies Array<UserDto>);
  })
  .post('/', async (req, res) => {
    console.log('[POST] User :', req.body.email);
    try {
      const user = await db.user.create({
        data: {
          id: generateIdFromEntropySize(10),
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          employerName: req.body.employerName,
          employerPhone: req.body.employerPhone,
          role: req.body.role,
          statut: Statut.Actif,
        },
      });
      res.json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  })
  .put('/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log('[PUT] User ID:', userId);
    try {
      const {
        name,
        surname,
        email,
        employerName,
        employerPhone,
        role,
        statut,
      } = req.body;

      const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          name,
          surname,
          email,
          employerName,
          employerPhone,
          role,
          statut,
        },
      });
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

export { usersRouter };
