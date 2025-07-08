import { useGetAllBorrowQuery } from '@/Redux/baseApi/baseApi';
import type { TBorrow } from '@/Types/TBorrow';

const AllBorrow = () => {
    const { data } = useGetAllBorrowQuery(undefined)
    return (
        <div className='m-5'>
            <p className='text-2xl font-semibold text-center mb-3'>Borrow Summery</p>
            <div className="overflow-x-auto border rounded-lg">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr className='border-b border-slate-300'>
                            <th></th>
                            <th>Book Title</th>
                            <th>ISBN</th>
                            <th>Total Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.data?.map((borrow: TBorrow, index: number) => (
                                <tr key={index} className='border-b border-slate-300'>
                                    <th className='min-w-[30px]'>{index + 1}</th>
                                    <td className='min-w-[300px]'>{borrow.book.title}</td>
                                    <td className='min-w-[200px]'>{borrow.book.isbn}</td>
                                    <td className='min-w-[90px]'><span className='text-lg font-semibold'>{borrow.totalQuantity}</span> pice</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllBorrow;