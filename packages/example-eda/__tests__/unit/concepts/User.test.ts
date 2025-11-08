import { User } from '../../../src/plugins/users/concepts/User';

describe('User Concept', () => {
  beforeEach(() => {
    // Reset state before each test
    User.state = {
      users: new Map(),
      emails: new Set(),
      usernames: new Set(),
    };
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const result = await User.execute('register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result.userId).toBeDefined();
      expect(result.user.username).toBe('testuser');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.status).toBe('active');
      expect(result.user.createdAt).toBeInstanceOf(Date);
    });

    it('should prevent duplicate email registration', async () => {
      await User.execute('register', {
        username: 'user1',
        email: 'same@example.com',
        password: 'pass1'
      });

      await expect(User.execute('register', {
        username: 'user2',
        email: 'same@example.com',
        password: 'pass2'
      })).rejects.toThrow('Email already registered');
    });

    it('should prevent duplicate username registration', async () => {
      await User.execute('register', {
        username: 'sameuser',
        email: 'user1@example.com',
        password: 'pass1'
      });

      await expect(User.execute('register', {
        username: 'sameuser',
        email: 'user2@example.com',
        password: 'pass2'
      })).rejects.toThrow('Username already taken');
    });

    it('should validate required fields', async () => {
      await expect(User.execute('register', {
        username: 'testuser'
        // missing email and password
      })).rejects.toThrow('Username, email, and password are required');
    });
  });

  describe('User Retrieval', () => {
    it('should get user by ID', async () => {
      const registerResult = await User.execute('register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      const getResult = await User.execute('get', {
        userId: registerResult.userId
      });

      expect(getResult.user.id).toBe(registerResult.userId);
      expect(getResult.user.username).toBe('testuser');
    });

    it('should throw error for non-existent user', async () => {
      await expect(User.execute('get', {
        userId: 'non-existent-id'
      })).rejects.toThrow('User not found');
    });
  });

  describe('User Updates', () => {
    it('should update user information', async () => {
      const registerResult = await User.execute('register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      const updateResult = await User.execute('update', {
        userId: registerResult.userId,
        updates: {
          email: 'newemail@example.com'
        }
      });

      expect(updateResult.user.email).toBe('newemail@example.com');
      expect(updateResult.user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('User Deactivation', () => {
    it('should deactivate user', async () => {
      const registerResult = await User.execute('register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      const deactivateResult = await User.execute('deactivate', {
        userId: registerResult.userId
      });

      expect(deactivateResult.user.status).toBe('inactive');
      expect(deactivateResult.user.deactivatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Unknown Actions', () => {
    it('should throw error for unknown actions', async () => {
      await expect(User.execute('unknownAction', {}))
        .rejects.toThrow('Unknown action: unknownAction');
    });
  });
});