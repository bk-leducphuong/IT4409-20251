import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import addressService from '../../services/address.service.js';
import Address from '../../models/address.js';
import mongoose from 'mongoose';

// Mock the Address model
jest.mock('../../models/address.js');

describe('Address Service', () => {
  const userId = new mongoose.Types.ObjectId();
  const addressId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAddresses', () => {
    it('should return all addresses for a user', async () => {
      const mockAddresses = [
        {
          _id: addressId,
          user: userId,
          fullName: 'Nguyen Van A',
          phone: '0987654321',
          addressLine1: '123 Nguyen Trai',
          city: 'Thanh Xuan',
          province: 'Ha Noi',
          country: 'Vietnam',
          isDefault: true,
        },
      ];

      Address.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockAddresses),
      });

      const result = await addressService.getAddresses(userId);

      expect(Address.find).toHaveBeenCalledWith({ user: userId, deleted: false });
      expect(result).toEqual(mockAddresses);
    });

    it('should throw error when database operation fails', async () => {
      Address.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(addressService.getAddresses(userId)).rejects.toThrow(
        'Không thể lấy danh sách địa chỉ',
      );
    });
  });

  describe('getAddressById', () => {
    it('should return address by ID', async () => {
      const mockAddress = {
        _id: addressId,
        user: userId,
        fullName: 'Nguyen Van A',
        phone: '0987654321',
      };

      Address.findOne = jest.fn().mockResolvedValue(mockAddress);

      const result = await addressService.getAddressById(userId, addressId);

      expect(Address.findOne).toHaveBeenCalledWith({
        _id: addressId,
        user: userId,
        deleted: false,
      });
      expect(result).toEqual(mockAddress);
    });

    it('should throw error if address not found', async () => {
      Address.findOne = jest.fn().mockResolvedValue(null);

      await expect(addressService.getAddressById(userId, addressId)).rejects.toThrow(
        'Địa chỉ không tồn tại!',
      );
    });
  });

  describe('createAddress', () => {
    const validAddressData = {
      fullName: 'Nguyen Van A',
      phone: '0987654321',
      addressLine1: '123 Nguyen Trai',
      city: 'Thanh Xuan',
      province: 'Ha Noi',
      country: 'Vietnam',
      addressType: 'both',
      isDefault: false,
    };

    it('should create a new address successfully', async () => {
      Address.countDocuments = jest.fn().mockResolvedValue(1);
      Address.create = jest.fn().mockResolvedValue({
        _id: addressId,
        user: userId,
        ...validAddressData,
      });

      const result = await addressService.createAddress(userId, validAddressData);

      expect(Address.create).toHaveBeenCalled();
      expect(result).toMatchObject(validAddressData);
    });

    it('should make first address default automatically', async () => {
      Address.countDocuments = jest.fn().mockResolvedValue(0);
      Address.create = jest.fn().mockResolvedValue({
        _id: addressId,
        user: userId,
        ...validAddressData,
        isDefault: true,
      });

      const result = await addressService.createAddress(userId, validAddressData);

      expect(result.isDefault).toBe(true);
    });

    it('should throw error if required fields are missing', async () => {
      const invalidData = { fullName: 'Test' };

      await expect(addressService.createAddress(userId, invalidData)).rejects.toThrow(
        'Vui lòng điền đầy đủ thông tin bắt buộc!',
      );
    });

    it('should throw error if phone number is invalid', async () => {
      const invalidPhoneData = {
        ...validAddressData,
        phone: '123', // Invalid phone
      };

      await expect(addressService.createAddress(userId, invalidPhoneData)).rejects.toThrow(
        'Số điện thoại không hợp lệ!',
      );
    });

    it('should throw error if full name is too short', async () => {
      const invalidNameData = {
        ...validAddressData,
        fullName: 'A', // Too short
      };

      await expect(addressService.createAddress(userId, invalidNameData)).rejects.toThrow(
        'Họ tên phải từ 2 đến 100 ký tự!',
      );
    });

    it('should throw error if address type is invalid', async () => {
      const invalidTypeData = {
        ...validAddressData,
        addressType: 'invalid', // Invalid type
      };

      await expect(addressService.createAddress(userId, invalidTypeData)).rejects.toThrow(
        'Loại địa chỉ không hợp lệ!',
      );
    });
  });

  describe('updateAddress', () => {
    const mockAddress = {
      _id: addressId,
      user: userId,
      fullName: 'Nguyen Van A',
      phone: '0987654321',
      addressLine1: '123 Nguyen Trai',
      city: 'Thanh Xuan',
      province: 'Ha Noi',
      save: jest.fn(),
    };

    it('should update address successfully', async () => {
      Address.findOne = jest.fn().mockResolvedValue(mockAddress);
      mockAddress.save.mockResolvedValue(mockAddress);

      const updateData = { fullName: 'Nguyen Van B' };
      const result = await addressService.updateAddress(userId, addressId, updateData);

      expect(Address.findOne).toHaveBeenCalled();
      expect(mockAddress.save).toHaveBeenCalled();
    });

    it('should throw error if address not found', async () => {
      Address.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        addressService.updateAddress(userId, addressId, { fullName: 'Test' }),
      ).rejects.toThrow('Địa chỉ không tồn tại!');
    });

    it('should throw error if phone number is invalid', async () => {
      Address.findOne = jest.fn().mockResolvedValue(mockAddress);

      await expect(
        addressService.updateAddress(userId, addressId, { phone: '123' }),
      ).rejects.toThrow('Số điện thoại không hợp lệ!');
    });
  });

  describe('deleteAddress', () => {
    it('should delete address successfully', async () => {
      const mockAddress = {
        _id: addressId,
        user: userId,
        isDefault: false,
        deleted: false,
        save: jest.fn().mockResolvedValue(true),
      };

      Address.findOne = jest.fn().mockResolvedValue(mockAddress);

      const result = await addressService.deleteAddress(userId, addressId);

      expect(mockAddress.deleted).toBe(true);
      expect(mockAddress.save).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should set new default when deleting default address', async () => {
      const mockDefaultAddress = {
        _id: addressId,
        user: userId,
        isDefault: true,
        deleted: false,
        save: jest.fn().mockResolvedValue(true),
      };

      const newDefaultAddress = {
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        isDefault: false,
        save: jest.fn().mockResolvedValue(true),
      };

      Address.findOne = jest
        .fn()
        .mockResolvedValueOnce(mockDefaultAddress)
        .mockResolvedValueOnce(newDefaultAddress);

      await addressService.deleteAddress(userId, addressId);

      expect(newDefaultAddress.isDefault).toBe(true);
      expect(newDefaultAddress.save).toHaveBeenCalled();
    });

    it('should throw error if address not found', async () => {
      Address.findOne = jest.fn().mockResolvedValue(null);

      await expect(addressService.deleteAddress(userId, addressId)).rejects.toThrow(
        'Địa chỉ không tồn tại!',
      );
    });
  });

  describe('setDefaultAddress', () => {
    it('should set address as default successfully', async () => {
      const mockAddress = {
        _id: addressId,
        user: userId,
        isDefault: false,
        save: jest.fn().mockResolvedValue(true),
      };

      Address.findOne = jest.fn().mockResolvedValue(mockAddress);

      const result = await addressService.setDefaultAddress(userId, addressId);

      expect(mockAddress.isDefault).toBe(true);
      expect(mockAddress.save).toHaveBeenCalled();
    });

    it('should throw error if address not found', async () => {
      Address.findOne = jest.fn().mockResolvedValue(null);

      await expect(addressService.setDefaultAddress(userId, addressId)).rejects.toThrow(
        'Địa chỉ không tồn tại!',
      );
    });
  });

  describe('getDefaultAddress', () => {
    it('should return default address', async () => {
      const mockAddress = {
        _id: addressId,
        user: userId,
        isDefault: true,
      };

      Address.findOne = jest.fn().mockResolvedValue(mockAddress);

      const result = await addressService.getDefaultAddress(userId);

      expect(Address.findOne).toHaveBeenCalledWith({
        user: userId,
        deleted: false,
        isDefault: true,
      });
      expect(result).toEqual(mockAddress);
    });

    it('should return null if no default address exists', async () => {
      Address.findOne = jest.fn().mockResolvedValue(null);

      const result = await addressService.getDefaultAddress(userId);

      expect(result).toBeNull();
    });
  });
});
