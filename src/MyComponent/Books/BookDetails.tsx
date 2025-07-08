import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useBookDetailsQuery, useBorrowBookMutation } from '@/Redux/baseApi/baseApi';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, type FieldValues, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { ErrorResponse } from '@/Types/TBorrow';

const BookDetails = () => {
    const { bookId } = useParams();
    const { data } = useBookDetailsQuery(bookId)
    const [borrowLoading, setBorrowLoading] = useState(false);
    const navigate = useNavigate()

    const { register: borrowRegister, handleSubmit: handleBorrowSubmit, formState: { errors: borrowErrors }, reset: resetBorrowForm, control: borrowControl } = useForm();
    // Borrow state 
    const [openBorrowModal, setOpenBorrowModal] = useState(false);
    const [borrowBook] = useBorrowBookMutation()

    const handleBorrowModal = () => {
        setOpenBorrowModal(true)
    }

    const handleBorrow: SubmitHandler<FieldValues> = async (data) => {
        const localDate = new Date(data?.dueDate)
        data.dueDate = localDate.toISOString()
        setBorrowLoading(true)
        try {
            const quantityInNumber = Number(data.quantity)
            const payload = {
                book: bookId,
                quantity: quantityInNumber,
                dueDate: data.dueDate
            }

            const res = await borrowBook(payload)
            console.log(res);
            if (res?.data?.success) {
                setBorrowLoading(false)
                setOpenBorrowModal(false)
                resetBorrowForm()
                navigate('/borrow-summary')
                return toast.success(res?.data?.message)
            }
            if (res.error) {
                setBorrowLoading(false)
                const errorData = res.error as ErrorResponse;
                return toast.error(errorData.data.message);
            }

        } catch (error) {
            setBorrowLoading(false)
            console.log(error);
        }
    }

    return (
        <div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                                {data?.data?.title}
                            </h1>
                            <p className="text-gray-500 text-base sm:text-lg mt-1">by {data?.data?.author}</p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                            <span
                                className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${data?.data?.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                    }`}
                            >
                                {data?.data?.available ? "Available" : "Not Available"}
                            </span>

                            {/* Borrow Now Button */}
                            <button
                                onClick={() => handleBorrowModal()}
                                disabled={!data?.data?.available || borrowLoading}
                                className={`mt-2 inline-flex items-center justify-center px-6 py-2 rounded-full text-white font-semibold text-sm transition-all duration-200 ${data?.data?.available
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {borrowLoading ? (
                                    <>
                                        <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Borrowing...
                                    </>
                                ) : (
                                    "Borrow Now"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Body Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Left: Description and Dates */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">📖 Description</h3>
                            <p className="text-gray-600 leading-relaxed text-base">{data?.data?.description}</p>

                            <div className="mt-6 space-y-1 text-sm text-gray-400">
                                <p>🗓️ Created: {new Date(data?.data?.createdAt).toLocaleDateString()}</p>
                                <p>✏️ Updated: {new Date(data?.data?.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Right: Book Info Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-gray-700">
                            <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                                <p className="text-sm text-gray-500">📚 Genre</p>
                                <p className="font-semibold">{data?.data?.genre}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                                <p className="text-sm text-gray-500">🔖 ISBN</p>
                                <p className="font-semibold break-words">{data?.data?.isbn}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                                <p className="text-sm text-gray-500">📦 Copies</p>
                                <p className="font-semibold">{data?.data?.copies}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                                <p className="text-sm text-gray-500">🆔 Book ID</p>
                                <p className="font-semibold break-words">{data?.data?._id}</p>
                            </div>
                        </div>
                    </div>
                </div>
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
                                        <Button className="btn border-none ">Cancel</Button>
                                    </DialogClose>
                                    {
                                        borrowLoading === true ?
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
    )
};

export default BookDetails