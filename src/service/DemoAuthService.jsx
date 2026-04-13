const DEMO_USERS_STORAGE_KEY = 'demoAuthUsers';

const readUsers = () => {
    try {
        const raw = localStorage.getItem(DEMO_USERS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
};

const saveUsers = (users) => {
    localStorage.setItem(DEMO_USERS_STORAGE_KEY, JSON.stringify(users));
};

const register = ({firstName, lastName, email, password}) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const users = readUsers();
    const exists = users.some((user) => String(user.email || '').toLowerCase() === normalizedEmail);

    if (exists) {
        return {
            success: false,
            message: 'Bu e-posta ile daha önce kayıt oluşturulmuş.'
        };
    }

    const createdUser = {
        id: `demo-user-${Date.now()}`,
        name: String(firstName || '').trim(),
        surname: String(lastName || '').trim(),
        email: normalizedEmail,
        password: String(password || ''),
        createdAt: new Date().toISOString()
    };

    users.push(createdUser);
    saveUsers(users);

    return {
        success: true,
        user: {
            id: createdUser.id,
            name: createdUser.name,
            surname: createdUser.surname,
            email: createdUser.email
        }
    };
};

const login = (email, password) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const rawPassword = String(password || '');
    const users = readUsers();

    const matchedUser = users.find((user) => {
        return String(user.email || '').toLowerCase() === normalizedEmail && String(user.password || '') === rawPassword;
    });

    if (!matchedUser) {
        throw new Error('Kullanıcı adı veya şifre hatalı');
    }

    return {
        token: `demo-token-${matchedUser.id}-${Date.now()}`,
        user: {
            id: matchedUser.id,
            name: matchedUser.name,
            surname: matchedUser.surname,
            email: matchedUser.email
        }
    };
};

export default {
    register,
    login
};

