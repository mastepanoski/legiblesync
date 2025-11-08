import { User } from '../../../src/concepts/User';

describe('User Concept', () => {
  beforeEach(() => {
    // Reset state
    User.state.users.clear();
    User.state.username.clear();
    User.state.email.clear();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const result = await User.execute('register', {
        user: 'user123',
        username: 'testuser',
        email: 'test@example.com'
      });

      expect(result.user).toBe('user123');
      expect(User.state.users.has('user123')).toBe(true);
      expect(User.state.username.get('user123')).toBe('testuser');
      expect(User.state.email.get('user123')).toBe('test@example.com');
    });

    it('should throw error for duplicate username', async () => {
      await User.execute('register', {
        user: 'user123',
        username: 'testuser',
        email: 'test@example.com'
      });

      await expect(User.execute('register', {
        user: 'user456',
        username: 'testuser',
        email: 'other@example.com'
      })).rejects.toThrow('Username taken');
    });

    it('should throw error for duplicate user', async () => {
      await User.execute('register', {
        user: 'user123',
        username: 'testuser',
        email: 'test@example.com'
      });

      await expect(User.execute('register', {
        user: 'user123',
        username: 'otheruser',
        email: 'other@example.com'
      })).rejects.toThrow('User exists');
    });

    it('should throw error for duplicate email', async () => {
      await User.execute('register', {
        user: 'user123',
        username: 'testuser',
        email: 'test@example.com'
      });

      await expect(User.execute('register', {
        user: 'user456',
        username: 'otheruser',
        email: 'test@example.com'
      })).rejects.toThrow('Email taken');
    });

    it('should throw error for empty username', async () => {
      await expect(User.execute('register', {
        user: 'user123',
        username: '',
        email: 'test@example.com'
      })).rejects.toThrow('Username required');
    });

    it('should throw error for invalid email', async () => {
      await expect(User.execute('register', {
        user: 'user123',
        username: 'testuser',
        email: 'invalid-email'
      })).rejects.toThrow('Valid email required');
    });
  });
});