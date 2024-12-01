import { Test, TestingModule } from '@nestjs/testing';
import { getValidAdmin, getValidCreateAdminDto } from '__tests__/__util__/validObjects';
import { PrismaService } from 'prisma/prisma.service';
import { AdminService } from '../../src/modules/admin/admin.service';
import { AdminRepository } from '../../src/modules/admin/admin.repository';
import { EmailService } from '../../src/modules/email/email.service';
import { faker } from '@faker-js/faker';
import { Admin } from '@prisma/client';
import { BadRequestException } from '@nestjs/common/exceptions';

const mockAdminRepositoryGet = jest.fn();
const mockAdminRepositoryInsertAdmin = jest.fn();
const mockAdminRepositoryGetByEmail = jest.fn();
const mockAdminRepositoryInsertCode = jest.fn();
const mockAdminRepositoryChangePassword = jest.fn();
const mockEmailServiceSendEmail = jest.fn();

const mockPrismaService = {};

jest.mock('../../src/modules/admin/admin.repository', () => ({
    AdminRepository: jest.fn().mockImplementation(() => ({
        getAdmins: mockAdminRepositoryGet,
        insertAdmin: mockAdminRepositoryInsertAdmin,
        getAdminByEmail: mockAdminRepositoryGetByEmail,
        insertCode: mockAdminRepositoryInsertCode,
        changePassword: mockAdminRepositoryChangePassword,
    })),
}));

jest.mock('../../src/modules/email/email.service', () => ({
    EmailService: jest.fn().mockImplementation(() => ({
        sendMail: mockEmailServiceSendEmail,
    })),
}));

describe('AdminService', () => {
    let adminService: AdminService;

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminService,
                { provide: AdminRepository, useClass: AdminRepository },
                { provide: EmailService, useClass: EmailService },
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        adminService = module.get<AdminService>(AdminService);
    });

    describe('getAdmins', () => {
        it('given existing admins, when getAdmins is called, then it should return a list of admins', async () => {
            const mockAdmins = [getValidAdmin(), getValidAdmin()];

            mockAdminRepositoryGet.mockResolvedValue(mockAdmins);
    
            const result = await adminService.getAdmins();
    
            expect(result).toEqual(mockAdmins);
            expect(mockAdminRepositoryGet).toHaveBeenCalledTimes(1);
        });
    });
    
    describe('insertAdmin', () => {
        it('given valid data, when insertAdmin is called, then it should insert a new admin', async () => {
            const createAdminDto = getValidCreateAdminDto();
    
            await adminService.insertAdmin(createAdminDto);
    
            expect(mockAdminRepositoryInsertAdmin).toHaveBeenCalledWith(createAdminDto);
            expect(mockAdminRepositoryInsertAdmin).toHaveBeenCalledTimes(1);
        });
    });
    
    describe('findOne', () => {
        it('given an email, when findOne is called, then it should return the corresponding admin', async () => {
            const email = 'admin1@example.com';

            const mockAdmin = getValidAdmin();

            mockAdminRepositoryGetByEmail.mockResolvedValue(mockAdmin);
    
            const result = await adminService.findOne(email);
    
            expect(result).toEqual(mockAdmin);
            expect(mockAdminRepositoryGetByEmail).toHaveBeenCalledWith(email);
            expect(mockAdminRepositoryGetByEmail).toHaveBeenCalledTimes(1);
        });
    });
    
    describe('resetPasswordEmail', () => {
        it('given an email, when resetPasswordEmail is called, then it should send a reset password email', async () => {
            const email = faker.internet.email();

            let admin: Admin = getValidAdmin();
            admin.email = email;
            
            mockAdminRepositoryInsertCode.mockResolvedValue(admin);
    
            const newAdmin: Admin = await adminService.resetPasswordEmail(email);
    
            expect(mockAdminRepositoryInsertCode).toHaveBeenCalledTimes(1);
            expect(mockEmailServiceSendEmail).toHaveBeenCalledTimes(1);
            expect(newAdmin).not.toBeNull();
        });
    });
    
    describe('resetPassword', () => {
        it('given valid password, when resetPassword is called, then it should reset the admin password', async () => {
            const resetPasswordDto = { email: 'admin1@example.com', code: '123456', newPassword: 'newpassword' };
            const mockAdmin = getValidAdmin();
            mockAdmin.email = resetPasswordDto.email;
            mockAdmin.code = resetPasswordDto.code;

            mockAdminRepositoryGetByEmail.mockResolvedValue(mockAdmin);
    
            await adminService.resetPassword(resetPasswordDto);
    
            expect(mockAdminRepositoryGetByEmail).toHaveBeenCalledWith(resetPasswordDto.email);
            expect(mockAdminRepositoryGetByEmail).toHaveBeenCalledTimes(1);
            expect(mockAdminRepositoryChangePassword).toHaveBeenCalledTimes(1);
        });
    
        it('given invalid verification code, when resetPassword is called, then it should throw BadRequestException', async () => {
            const passwordDto = { email: 'admin1@example.com', code: 'invalidcode', newPassword: 'newpassword' };
            const mockAdmin = getValidAdmin();

            mockAdminRepositoryGetByEmail.mockResolvedValue(mockAdmin);
    
            await expect(adminService.resetPassword(passwordDto)).rejects.toThrow(BadRequestException);
            expect(mockAdminRepositoryGetByEmail).toHaveBeenCalledWith(passwordDto.email);
            expect(mockAdminRepositoryGetByEmail).toHaveBeenCalledTimes(1);
        });
    });
    
});
