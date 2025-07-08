
const BookHero = () => {
    return (
        <div className=' items-center bg-cover bg-no-repeat bg-[url("https://res.cloudinary.com/depy0i4bl/image/upload/v1751866750/book_bg_1_o7w38r.jpg")]'>
            <div className='flex justify-between items-center border'>
                <div className='w-1/2 md:w-1/2 lg:w-1/2 ml-5 lg:ml-10 '>
                    <h1 className='text-lg md:text-3xl lg:text-4xl my-1 md:my-4 lg:my-4 font-bold'>Explore Our Book Collection</h1>
                    <p className=' text-[12px] text-slate-500 md:text-base lg:text-base lg:w-3/4 '>Find your next read from a wide range of books. Add new titles or borrow directly from the list.</p>
                </div>
                <img className='w-1/2 md:w-1/2 lg:w-2/5' src="https://res.cloudinary.com/depy0i4bl/image/upload/v1751866753/book_1_daamiv.png" alt="" />
            </div>
        </div>
    );
};

export default BookHero;