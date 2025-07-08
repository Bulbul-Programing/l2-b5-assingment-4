import AllBooksCart from '@/MyComponent/AllBooksCart';
import HomePage from '@/MyComponent/HomePage';

const Home = () => {
    return (
        <div>
            <HomePage />
            {/* <AllBooks></AllBooks> */}
            <AllBooksCart />
        </div>
    );
};

export default Home;