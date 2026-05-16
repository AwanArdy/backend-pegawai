import { Request, Response } from 'express';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Pegawai from '../models/Pegawai';
import fs from 'fs';

const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey123', {
        expiresIn: '30d',
    });
};

export const login = async (req: Request, res: Response) => {
    const { nip, password } = req.body; // nip here acts as identifier (could be nip or name)

    try {
        const user = await User.findOne({ 
            where: {
                [Op.or]: [
                    { nip: nip },
                    { name: nip }
                ]
            } 
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    nip: user.nip,
                    email: user.email,
                    role: user.role,
                    jabatan: user.jabatan,
                    avatar: user.avatar,
                    token: generateToken(user.id),
                },
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid NIP/Username or password' });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};



export const getMe = async (req: any, res: Response) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Pegawai,
                    as: 'pegawai',
                    include: ['jabatan', 'golongan', 'unit_kerja']
                }
            ]
        });

        res.json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProfile = async (req: any, res: Response) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { name, email } = req.body;
        const avatar = req.file?.path;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (avatar) updateData.avatar = avatar;

        await user.update(updateData);

        // Sync with Pegawai if exists
        await Pegawai.update(
            { 
                nama: name || user.name, 
                email: email || user.email,
                avatar: avatar || user.avatar
            },
            { where: { nip: user.nip } }
        );

        // Save file to disk only after DB success
        if (req.file) {
            fs.writeFileSync(req.file.fullPath, req.file.buffer);
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user.id,
                name: user.name,
                nip: user.nip,
                email: user.email,
                role: user.role,
                jabatan: user.jabatan,
                avatar: user.avatar
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePassword = async (req: any, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findByPk(req.user.id);

        if (user && (await bcrypt.compare(oldPassword, user.password))) {
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            res.json({ success: true, message: 'Password updated successfully' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid old password' });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
