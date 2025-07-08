import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useBorrowBookMutation, useGetAllBooksQuery } from '@/Redux/baseApi/baseApi';
import type { TBook } from '@/Types/TBooks';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, type FieldValues, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';

const AllBooksCart = () => {
    const { data } = useGetAllBooksQuery(undefined)
    const [loading, setLoading] = useState({
        borrowLoading: false
    })
    const navigate = useNavigate()

    // // Borrow Book form
    const { register: borrowRegister, handleSubmit: handleBorrowSubmit, formState: { errors: borrowErrors }, reset: resetBorrowForm, control: borrowControl } = useForm();
    // Borrow state 
    const [openBorrowModal, setOpenBorrowModal] = useState(false);
    const [borrowId, setBorrowId] = useState('')
    const [borrowBook] = useBorrowBookMutation()

    const handleBorrowModal = (borrowId: string) => {
        setBorrowId(borrowId)
        setOpenBorrowModal(true)
    }

    const handleBorrow: SubmitHandler<FieldValues> = async (data) => {
        const localDate = new Date(data?.dueDate)
        data.dueDate = localDate.toISOString()
        setLoading(prev => ({ ...prev, borrowLoading: true }))
        try {
            const quantityInNumber = Number(data.quantity)
            const payload = {
                book: borrowId,
                quantity: quantityInNumber,
                dueDate: data.dueDate
            }

            const res = await borrowBook(payload)
            console.log(res);
            if (res?.data?.success) {
                setLoading(prev => ({ ...prev, borrowLoading: false }))
                setOpenBorrowModal(false)
                resetBorrowForm()
                navigate('/borrow-summary')
                return toast.success(res?.data?.message)
            }
            if (res.error) {
                setLoading(prev => ({ ...prev, borrowLoading: false }))
                return toast.error('Something went Wrong!')
            }

        } catch (error) {
            setLoading(prev => ({ ...prev, borrowLoading: false }))
            console.log(error);
        }
    }

    return (
        <div>
            <h1 className='text-3xl font-bold text-center mt-5'> Discover & Borrow Books</h1>
            <p className='text-center mt-1'>Find your next read from our full book archive.</p>
            <div className='grid grid-cols-3 gap-4 m-5'>
                {
                    data?.data?.map((book: TBook) => (
                        <div className="max-w-md w-full bg-white rounded-2xl shadow-md border p-6 hover:shadow-xl transition duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{book.title}</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        by <span className="font-medium text-gray-700">{book.author}</span>
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${book.available
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}
                                >
                                    {book.available ? 'Available' : 'Unavailable'}
                                </span>
                            </div>

                            <div className="mt-4 text-sm text-gray-600 space-y-1">
                                <p className="line-clamp-2">{book.description}</p>
                                <p>
                                    <span className="font-medium">Genre:</span>{' '}
                                    <span className="uppercase font-semibold text-indigo-600">
                                        {book.genre}
                                    </span>
                                </p>
                                <p>
                                    <span className="font-medium">Copies:</span> {book.copies}
                                </p>
                                <p>
                                    <span className="font-medium">ISBN:</span> {book.isbn}
                                </p>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                {
                                    book.available ?
                                        <button
                                            className="px-4 cursor-pointer py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                            onClick={() => handleBorrowModal(book._id)}
                                        >
                                            Borrow
                                        </button> :
                                        <button
                                            className="px-4 cursor-not-allowed py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                            disabled={!book.available}
                                        >
                                            Borrow
                                        </button>

                                }
                                <Link to={`/books/${book._id}`}>
                                    <button className="px-4 cursor-pointer hover:bg-blue-500 hover:text-white  py-1.5 text-sm border border-gray-300 rounded-lg transition">
                                        Details
                                    </button>
                                </Link>

                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Borrow Modal */}
            <div>
                <Dialog key={'borrowModal'} open={openBorrowModal} onOpenChange={setOpenBorrowModal}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Borrow a book</DialogTitle>
                        </DialogHeader>
                        <div>
                            <form onSubmit={handleBorrowSubmit(handleBorrow)}>
                                <input className="border-2 mt-2 rounded-md focus:border-blue-500 px-2 w-full py-2" type="Number" defaultValue={1} min={1} placeholder="quantity" {...borrowRegister("quantity", { required: true })} />
                                {borrowErrors.quantity && <span className="text-red-500 mb-2 text-sm">Quantity field is required</span>}

                                <div>
                                    <label className="block mb-1 font-medium">Due Date</label>
                                    <Controller
                                        name="dueDate"
                                        control={borrowControl}
                                        rules={{ required: "Due date is required" }}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP") : <span>Select due date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {borrowErrors.dueDate?.message && <span className="text-red-500 text-sm mt-1">Due date is required</span>}
                                </div>

                                <div className=" flex gap-x-3 mt-3">
                                    <DialogClose asChild>
                                        <Button onClick={() => setBorrowId('')} className="btn border-none ">Cancel</Button>
                                    </DialogClose>
                                    {
                                        loading.borrowLoading === true ?
                                            <>
                                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                                Loading...
                                            </>
                                            :
                                            <Button type="submit" className="btn border-none bg-blue-500 text-white hover:bg-blue-600">Borrow Book</Button>
                                    }
                                </div>
                            </form>

                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default AllBooksCart;