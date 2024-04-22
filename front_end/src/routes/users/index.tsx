import { useLoaderData } from '@tanstack/react-router';
import CreateUserDialog from '~/components/users/CreateUserDialog';

const UsersPage = () => {
  const users = useLoaderData({
    from: '/users',
  });
  return (
    <div>
      <div className="flex justify-end">
        <CreateUserDialog />
      </div>
      <section className="mt-4">
        <h2 className="text-2xl font-bold">Clients</h2>
        <div className="grid grid-cols-7 bg-white rounded-lg px-4 py-2 text-[#284E91] font-semibold">
          <div className="col-span-1">Employeur</div>
          <div className="col-span-3">Nom</div>
          <div className="col-span-2">Prénom</div>
          <div className="col-span-1">Actions</div>
        </div>
        {users
          .filter((user) => user.role === 'Client')
          .map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-7 mt-2 px-4 py-2 bg-white rounded-lg"
            >
              <div className="col-span-1">{user.employerName}</div>
              <div className="col-span-3">{user.name}</div>
              <div className="col-span-2">{user.surname}</div>
              <div className="col-span-1">
                <CreateUserDialog oldUser={user} />
              </div>
            </div>
          ))}
      </section>
      <section className="mt-4">
        <h2 className="text-2xl font-bold">Collaborateurs</h2>
        <div className="grid grid-cols-5 bg-white rounded-lg px-4 py-2 text-[#284E91] font-semibold">
          <div className="col-span-2">Nom</div>
          <div className="col-span-2">Prénom</div>
          <div className="col-span-1">Actions</div>
        </div>
        {users
          .filter((user) => user.role === 'Collaborateur')
          .map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-5 mt-2 px-4 py-2 bg-white rounded-lg"
            >
              <div className="col-span-2">{user.name}</div>
              <div className="col-span-2">{user.surname}</div>
              <div className="col-span-1">
                <CreateUserDialog oldUser={user} />
              </div>
            </div>
          ))}
      </section>
    </div>
  );
};

export default UsersPage;
