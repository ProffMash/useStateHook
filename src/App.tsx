import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

interface TUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  }
}

function App() {
  const [fetchedData, setFetchedData] = useState<TUser[] | null>([]);
  const [reset, setReset] = useState<boolean>(false);

  const getUsers = async () => {
    try {
      const res = await axios.get('https://jsonplaceholder.typicode.com/users');
      setFetchedData(res.data);
      localStorage.setItem('users', JSON.stringify(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  const handleReset = () => {
    // Clear the fetchedData state
    setFetchedData(null);
    // Clear the data in local storage
    localStorage.removeItem('users');
    // Trigger a re-fetch by toggling the 'reset' state
    setReset(prevReset => !prevReset);
  };

  const getUser = async (id: number) => {
    try {
      const res = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
      setFetchedData([res.data]);
      localStorage.setItem('users', JSON.stringify([res.data]));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const localData = localStorage.getItem('users');
    if (localData) {
      setFetchedData(JSON.parse(localData));
    } else {
      getUsers();
    }
  }, [reset]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = (e.currentTarget.id as unknown as HTMLInputElement).value;
    if (Number(id)) {
      getUser(Number(id));
      e.currentTarget.reset();
    } else {
      alert('Please enter a valid id of type number');
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="id" placeholder="Enter user ID" />
          <button type="submit">Search</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </form>
      </div>
      <div className="users">
        {fetchedData && fetchedData.length > 0 ? (
          fetchedData.map((user: TUser) => (
            <div className="user" key={user.id}>
              <p><b>Name:</b> {user.name}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Address:</strong> {user.address.street}, {user.address.city}</p>
              <p><strong>Geo:</strong> lat: {user.address.geo.lat}, lng: {user.address.geo.lng}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Website:</strong> {user.website}</p>
              <p><strong>Company:</strong> {user.company.name}</p>
            </div>
          ))
        ) : (
          <div>Sorry, No data Fetcged! Try Again!</div>
        )}
      </div>
    </>
  );
}

export default App;
