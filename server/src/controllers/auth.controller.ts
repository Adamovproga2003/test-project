import { Request, Response } from 'express';
import { User } from '../models/User';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { verifiedRequest } from '../middlewares/auth.middleware';

class UserController {
  register = async (req: Request, res: Response) => {
    // #swagger.tags = ['Authorization']
    // #swagger.summary = 'Register user for access to admin panel.'
    // #swagger.description = 'Register user with username and password.'
    /*  
        #swagger.requestBody = {
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/AuthForm"
                    }  
                }
            }
        } 
    */

    try {
      const existedUser = await User.findOne({ username: req.body.username });

      if (existedUser) {
        /* 
        #swagger.responses[400] = { 
          description: 'User exists', 
          schema: { 
            error: 'User already registered'
          } 
        } 
        */
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'User already registered' });
      }

      const user = await User.create(req.body);

      /* 
      #swagger.responses[200] = {
          description: 'Success register',
          schema: { 
            user: {
              username: 'John Doe',
              hashedPassword:
                '$2b$10$b63K/D03WFBktWy552L5XuibmiD5SxCrKg9kHCqOYaZwxRjIg14u2'
            },
            msg: 'User registered successfully'
          } 
        }
     */
      res
        .status(StatusCodes.CREATED)
        .json({ user, msg: 'User registered successfully' });
    } catch (error) {
      /*
      #swagger.responses[500] = { 
        description: 'Internal Error', 
        schema: { 
          error: 'Registration failed'
        } 
      } 
      */
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Registration failed' });
    }
  };

  login = async (req: Request, res: Response) => {
    // #swagger.tags = ['Authorization']
    // #swagger.summary = 'Authenticate user.'
    // #swagger.description = 'Login user with username and password.'
    /*  
      #swagger.requestBody = {
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/AuthForm"
                    }  
                }
            }
        } 
    */
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        /* 
        #swagger.responses[401] = { 
          description: 'Authentication failed', 
          schema: { 
            error: 'Authentication failed'
          } 
        } 
        */
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Authentication failed' });
      }

      const passwordMatch = await user.authenticate(password);

      if (!passwordMatch) {
        /* 
        #swagger.responses[401] = { 
          description: 'Authentication failed', 
          schema: { 
            error: 'Authentication failed'
          } 
        } 
        */
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Authentication failed' });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY || '',
        {
          expiresIn: '1h',
        },
      );

      /* 
      #swagger.responses[200] = {
          description: 'Success register',
          schema: { 
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            msg: 'User registered successfully'
          } 
        }
     */
      res
        .cookie('token', token, { httpOnly: true })
        .status(StatusCodes.OK)
        .json({ msg: 'Login successfully!' });
    } catch (error) {
      /* 
        #swagger.responses[500] = { 
          description: 'Login failed', 
          schema: { 
            error: 'Login failed'
          } 
        } 
      */
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Login failed' });
    }
  };
  me = async (req: verifiedRequest, res: Response) => {
    // #swagger.tags = ['Authorization']
    // #swagger.summary = 'Get user information'
    // #swagger.description = 'Get authorization user information by token'
    /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
    */
    try {
      const user = await User.findById(req.userId).select('username');

      if (!user) {
        /* 
        #swagger.responses[401] = { 
          description: 'Authentication failed', 
          schema: { 
            error: 'Authentication failed'
          } 
        } 
        */
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Authentication failed' });
      }

      /* 
      #swagger.responses[200] = {
          description: 'Success register',
          schema: { 
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            msg: 'User registered successfully'
          } 
        }
     */
      res.status(StatusCodes.OK).json({ user, msg: 'Get info successfully!' });
    } catch (error) {
      /* 
        #swagger.responses[500] = { 
          description: 'Login failed', 
          schema: { 
            error: 'Login failed'
          } 
        } 
      */
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Get info failed' });
    }
  };
  logout = async (req: verifiedRequest, res: Response) => {
    // #swagger.tags = ['Authorization']
    // #swagger.summary = 'Logout user'
    // #swagger.description = 'Logout user from the session'
    /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
    */

    /* 
      #swagger.responses[200] = {
          description: 'Success register',
          schema: { 
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            msg: 'User registered successfully'
          } 
        }
     */
    return res
      .clearCookie('token')
      .status(200)
      .json({ msg: 'User logout successfully!' });
  };
}

export const userController = new UserController();
