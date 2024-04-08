import { Link, useLoaderData } from '@tanstack/react-router';
import { UserDto } from 'backend-types';
import CreateUserDialog from '~/components/users/CreateUserDialog';
import React , {useState, useEffect} from 'react';
import axios from 'axios';

const UsersPage = () => {
    const users = useLoaderData({
    from: '/users',
  });
  console.log("Type de users:", typeof users);
  console.log("Contenu de users:", users); 


  return (
    <div>
      <section className="mt-4">
        <div className="grid grid-cols-6 bg-white rounded-lg px-4 py-2 text-[#284E91] font-semibold">
          <div>ID</div>
          <div className="col-span-3">Nom</div>
          <div className="col-span-2">Prénom</div>
        </div>

        {Array.isArray(users) && users.map(user => (
          <div key={user.id} className="grid grid-cols-6 mt-2 px-4 py-2 bg-white rounded-lg">
            <div>{user.id}</div>
            <div className="col-span-3">{user.name}</div>
            <div className="col-span-2">{user.surname}</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default UsersPage;

