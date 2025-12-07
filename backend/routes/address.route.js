import express from 'express';
const router = express.Router();
import addressController from '../controllers/address.controller.js';
import { requireLogin } from '../middlewares/auth.middleware.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - fullName
 *         - phone
 *         - addressLine1
 *         - city
 *         - province
 *       properties:
 *         _id:
 *           type: string
 *           description: Address ID
 *         user:
 *           type: string
 *           description: User ID
 *         fullName:
 *           type: string
 *           description: Full name of recipient
 *           example: Nguyen Van A
 *         phone:
 *           type: string
 *           description: Phone number
 *           example: "0987654321"
 *         addressLine1:
 *           type: string
 *           description: Primary address line
 *           example: 123 Nguyen Trai
 *         addressLine2:
 *           type: string
 *           description: Secondary address line (optional)
 *           example: Apartment 4B
 *         city:
 *           type: string
 *           description: City or district
 *           example: Thanh Xuan
 *         province:
 *           type: string
 *           description: Province or state
 *           example: Ha Noi
 *         postalCode:
 *           type: string
 *           description: Postal code (optional)
 *           example: "100000"
 *         country:
 *           type: string
 *           description: Country
 *           default: Vietnam
 *           example: Vietnam
 *         addressType:
 *           type: string
 *           enum: [shipping, billing, both]
 *           default: both
 *           description: Type of address
 *         isDefault:
 *           type: boolean
 *           default: false
 *           description: Whether this is the default address
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/user/addresses:
 *   get:
 *     summary: Get all addresses for current user
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách địa chỉ thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     addresses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 */
router.get('/', requireLogin, addressController.getAddresses);

/**
 * @swagger
 * /api/user/addresses/default:
 *   get:
 *     summary: Get default address for current user
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Default address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     address:
 *                       $ref: '#/components/schemas/Address'
 *       404:
 *         description: No default address found
 *       401:
 *         description: Unauthorized
 */
router.get('/default', requireLogin, addressController.getDefaultAddress);

/**
 * @swagger
 * /api/user/addresses/{id}:
 *   get:
 *     summary: Get address by ID
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     address:
 *                       $ref: '#/components/schemas/Address'
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', requireLogin, addressController.getAddressById);

/**
 * @swagger
 * /api/user/addresses:
 *   post:
 *     summary: Create a new address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *               - addressLine1
 *               - city
 *               - province
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyen Van A
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               addressLine1:
 *                 type: string
 *                 example: 123 Nguyen Trai
 *               addressLine2:
 *                 type: string
 *                 example: Apartment 4B
 *               city:
 *                 type: string
 *                 example: Thanh Xuan
 *               province:
 *                 type: string
 *                 example: Ha Noi
 *               postalCode:
 *                 type: string
 *                 example: "100000"
 *               country:
 *                 type: string
 *                 example: Vietnam
 *               addressType:
 *                 type: string
 *                 enum: [shipping, billing, both]
 *                 example: both
 *               isDefault:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     address:
 *                       $ref: '#/components/schemas/Address'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', requireLogin, addressController.createAddress);

/**
 * @swagger
 * /api/user/addresses/{id}:
 *   put:
 *     summary: Update an address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               addressLine1:
 *                 type: string
 *               addressLine2:
 *                 type: string
 *               city:
 *                 type: string
 *               province:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               country:
 *                 type: string
 *               addressType:
 *                 type: string
 *                 enum: [shipping, billing, both]
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     address:
 *                       $ref: '#/components/schemas/Address'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', requireLogin, addressController.updateAddress);

/**
 * @swagger
 * /api/user/addresses/{id}/default:
 *   put:
 *     summary: Set an address as default
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Default address set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     address:
 *                       $ref: '#/components/schemas/Address'
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id/default', requireLogin, addressController.setDefaultAddress);

/**
 * @swagger
 * /api/user/addresses/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', requireLogin, addressController.deleteAddress);

export default router;
