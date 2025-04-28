import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-page">
      <h1>Мой профиль</h1>
      <div className="profile-info">
        <p>Email: {user?.email}</p>
        {/* Добавьте другие данные пользователя */}
      </div>
    </div>
  );
};

export default Profile;