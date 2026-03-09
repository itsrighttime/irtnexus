/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User registration and OTP authentication
 */

/**
 * @swagger
 * /v1/public/send-otp:
 *   post:
 *     summary: Send OTP for user registration
 *     description: |
 *       Step 1 of registration.
 *       Validates email and username availability, reserves identifiers,
 *       and sends a one-time password (OTP) to the user's email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fname
 *               - lname
 *               - email
 *               - username
 *             properties:
 *               fname:
 *                 type: string
 *                 example: John
 *               mname:
 *                 type: string
 *                 nullable: true
 *                 example: Michael
 *               lname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               username:
 *                 type: string
 *                 example: johndoe
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               code: 200
 *               message: OTP has been sent to your email
 *               uniqueCode: SECU-IN-00014
 *               data:
 *                 reservationToken: "resv_8f92bc..."
 *                 expiresIn: 300
 *               meta:
 *                 requestId: "req_123"
 *       208:
 *         description: OTP already sent (cooldown period)
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               code: 208
 *               message: Please wait before requesting another OTP
 *               uniqueCode: SECU-IN-00013
 *               meta:
 *                 requestId: "req_123"
 *       409:
 *         description: Email or username already exists
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               code: 409
 *               message: Email already exists
 *               uniqueCode: SECU-ER-00010
 *               meta:
 *                 requestId: "req_123"
 */

/**
 * @swagger
 * /v1/public/register:
 *   post:
 *     summary: Verify OTP and create user
 *     description: |
 *       Step 2 of registration.
 *       Verifies the OTP, validates the reservation token,
 *       and creates the user account.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fname
 *               - lname
 *               - email
 *               - otp
 *               - reservationToken
 *             properties:
 *               fname:
 *                 type: string
 *                 example: John
 *               mname:
 *                 type: string
 *                 nullable: true
 *                 example: Michael
 *               lname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               reservationToken:
 *                 type: string
 *                 example: "resv_8f92bc..."
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               code: 201
 *               message: User created successfully
 *               uniqueCode: SECU-IN-00018
 *               meta:
 *                 requestId: "req_456"
 *       400:
 *         description: Invalid OTP
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               code: 400
 *               message: Invalid OTP
 *               uniqueCode: SECU-ER-00017
 *               meta:
 *                 requestId: "req_456"
 *       410:
 *         description: Reservation expired or invalid
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               code: 410
 *               message: Reservation expired
 *               uniqueCode: SECU-ER-00015
 *               meta:
 *                 requestId: "req_456"
 *       423:
 *         description: Too many invalid OTP attempts
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               code: 423
 *               message: Too many OTP attempts
 *               uniqueCode: SECU-ER-00016
 *               meta:
 *                 requestId: "req_456"
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               code: 409
 *               message: User already exists
 *               uniqueCode: SECU-ER-00019
 *               meta:
 *                 requestId: "req_456"
 */
