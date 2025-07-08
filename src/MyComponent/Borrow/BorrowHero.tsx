
const BorrowHero = () => {
    return (
        <div>
            <section className="w-full px-4 md:px-5 pb-5 md:pb-0 bg-gray-100">
                <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row gap-2 md:gap-8  items-center">
                    {/* Left: Text Content */}
                    <div className="space-y-2 md:space-y-6">
                        <h1 className="text-xl md:text-3xl lg:text-5xl font-bold text-gray-800">
                            Borrow Summary
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Review your borrowed books, return dates, and borrowing history — all in one place. Stay organized and never miss a return deadline again.
                        </p>
                    </div>

                    {/* Right: Image */}
                    <div className="flex justify-center md:justify-end">
                        <img
                            src="https://res.cloudinary.com/depy0i4bl/image/upload/v1751988664/couple-student-with-reading-book-hands_1_fnhq8q.png" // 👈 Replace this with your actual image path
                            alt="Borrow Summary Illustration"
                            className=" max-w-xs md:max-w-xs lg:max-w-md"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BorrowHero;