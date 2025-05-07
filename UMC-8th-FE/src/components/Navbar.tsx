import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { ResponseMyInfoDto } from '../types/auth';
import { useEffect, useState } from 'react';
import { getMyInfo } from '../apis/auth';

const Navbar = () => {
  const {accessToken} = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
      const getData = async () => {
        const response = await getMyInfo();
        console.log(response);
  
        setData(response);
      };
  
      getData();
    }, []);

  return (
    <nav className='bg-white dark:bg-gray-900 shadow-md fixed w-full z-10'>
      <div className='flex items-center justify-between p-4'>
        <Link to='/' className='text-xl font-bold text-gray-900 dark:text-white'>SpinningSpinning Dolimpan</Link>
        <div className='space-x-6'>
          {!accessToken && (
            <>
            <Link to={'/login'} className='text-gray-700 dark:text-gray-300 hover:text-blue-500'>로그인</Link>
            <Link to={'/signup'} className='text-gray-700 dark:text-gray-300 hover:text-blue-500'>회원가입</Link>
            </>
          )}
          {accessToken && (
          <Link to={"/my"} className='text-gray-700 dark:text-gray-300 hover:text-blue-500'> {data?.data.name} 님, 환영합니다. </Link>
        )}
        <Link to={"/search"} className='text-gray-700 dark:text-gray-300 hover:text-blue-500'> 검색 </Link>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar
