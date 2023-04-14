import { Connection, Model, connect } from 'mongoose';
import { UserController } from './user.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User, UserSchema } from './entities/user.entity';
import { TestingModule, Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserRole } from '../@types/UserRoleEnum.type';

describe('User Controller Tests', () => {
  let userController: UserController;
  let mongoDB: MongoMemoryServer;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongoDB = await MongoMemoryServer.create();
    const mongoURL = mongoDB.getUri();
    const mongoConnection: Connection = (await connect(mongoURL)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  afterAll(async () => {
    await mongoDB.stop();
  });

  it('The UserController should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('Should be possible create a new user', async () => {
    const newUser = await userController.create({
      name: 'test',
      email: 'test@test',
      password: 'test',
      role: UserRole.ADMIN,
      imageUri: 'test',
    });
    expect(newUser).toBeDefined();
  });

  it('Should be possible find all users', async () => {
    const users = await userController.findAll();
    expect(users).toBeDefined();
  });

  it('Should be possible find one user', async () => {
    const newUser = await userController.create({
      name: 'test',
      email: 'test1@test',
      password: 'test',
      role: UserRole.ADMIN,
      imageUri: 'test',
    });
    const user = await userController.findOne(newUser._id.toString());
    expect(user).toBeDefined();
  });

  it('Should be possible update a user', async () => {
    const newUser = await userController.create({
      name: 'test',
      email: 'test2@test',
      password: 'test',
      role: UserRole.ADMIN,
      imageUri: 'test',
    });
    const updatedUser = await userController.update(newUser._id.toString(), {
      name: 'test2',
    });
    expect(updatedUser.name).toBe('test2');
  });

  it('Should be possible desactive a user', async () => {
    const newUser = await userController.create({
      name: 'test',
      email: 'test4@test',
      password: 'test',
      role: UserRole.ADMIN,
      imageUri: 'test',
    });
    const updatedUser = await userController.desactive(newUser._id.toString());
    expect(updatedUser.isActive).toBe(false);
  });

  it('Should be possible delete a user', async () => {
    const newUser = await userController.create({
      name: 'test',
      email: 'test5@test',
      password: 'test',
      role: UserRole.ADMIN,
      imageUri: 'test',
    });
    const deletedUser = await userController.remove(newUser._id.toString());
    expect(deletedUser).toBeDefined();
  });
});
