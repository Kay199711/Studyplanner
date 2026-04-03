import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';

export const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ success: false, error: 'Provide at least a name or email to update' });
    }

    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== id) {
        return res.status(409).json({ success: false, error: 'Email already in use' });
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    const { password: _, ...userWithoutPassword } = updated;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, error: 'All password fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'New passwords do not match' });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id }, data: { password: hashed } });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
