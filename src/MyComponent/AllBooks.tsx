import { useBorrowBookMutation, useDeleteBookMutation, useGetAllBooksQuery, useUpdateBookMutation } from '@/Redux/baseApi/baseApi';
import type { TBook } from '@/Types/TBooks';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { GiCardPickup } from "react-icons/gi";
import CreateNewBook from './Books/CreateNewBook';
import { toast } from 'sonner';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Controller, useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const AllBooks = () => {
    const { data } = useGetAllBooksQuery(undefined)
    const [deleteBook] = useDeleteBookMutation()
    const [deleteBookId, setDeleteBookId] = useState('')
    const [loading, setLoading] = useState({
        deleteLoading: false,
        editLoading: false,
        borrowLoading: false
    })
    const navigate = useNavigate()
    console.log(data);
    // update state
    const { register: updateRegister, handleSubmit: handleUpdateSubmit, formState: { errors: updateErrors }, reset: resetUpdateForm } = useForm();

    // // Borrow Book form
    const { register: borrowRegister, handleSubmit: handleBorrowSubmit, formState: { errors: borrowErrors }, reset: resetBorrowForm, control: borrowControl } = useForm();

    const [updateBook] = useUpdateBookMutation()
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [editId, setEditId] = useState('')

    // Borrow state 
    const [openBorrowModal, setOpenBorrowModal] = useState(false);
    const [borrowId, setBorrowId] = useState('')
    const [borrowBook] = useBorrowBookMutation()


    const handleEditModal = (editId: string) => {
        setEditId(editId)
        setOpenUpdateModal(true)
        const bookToEdit = data?.data?.find((book: TBook) => book._id === editId)
        if (bookToEdit) {
            resetUpdateForm({
                title: bookToEdit.title,
                author: bookToEdit.author,
                isbn: bookToEdit.isbn,
                genre: bookToEdit.genre,
                copies: bookToEdit.copies,
                description: bookToEdit.description
            });
        }
    }

    const handleBorrowModal = (borrowId: string) => {
        setBorrowId(borrowId)
        setOpenBorrowModal(true)
    }

    const handleDelete = async (bookId: string) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading(prev => ({ ...prev, deleteLoading: true }))
                    setDeleteBookId(bookId)
                    const res = await deleteBook(bookId)
                    if (res?.data?.success) {
                        setLoading(prev => ({ ...prev, deleteLoading: false }))
                        setDeleteBookId('')
                        return toast.success(res?.data?.message)
                    }
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                }
            });
        } catch (error) {
            setLoading(prev => ({ ...prev, deleteLoading: false }))
            console.log(error);
        }
    }

    const handleUpdate: SubmitHandler<FieldValues> = async (data) => {
        setLoading(prev => ({ ...prev, editLoading: true }))
        try {
            const updateAvailable = {
                ...data,
                available: data.available === 'true' ? true : false
            }
            const payload = {
                id: editId,
                data: updateAvailable
            }
            
            console.log(payload);
            const res = await updateBook(payload)
            console.log(res);
            if (res?.data?.success) {
                setLoading(prev => ({ ...prev, editLoading: false }))
                setOpenUpdateModal(false)
                resetUpdateForm()
                return toast.success(res?.data?.message)
            }
        } catch (error) {
            setLoading(prev => ({ ...prev, editLoading: false }))
            console.log(error);
        }
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
        <div className='m-5'>
            <h1 className='text-4xl font-bold text-center my-5'>All Books</h1>
            <div className='flex justify-end mb-5'>
                <CreateNewBook />
            </div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Copies</th>
                            <th>Available</th>
                            <th>Genre</th>
                            <th className='text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.data?.map((book: TBook, index: number) => (
                                <tr key={index}>
                                    <th className='min-w-[30px]'>{index + 1}</th>
                                    <td className='min-w-[300px]'>{book.title}</td>
                                    <td className='min-w-[200px]'>{book.author}</td>
                                    <td className='min-w-[130px]'>{book.isbn}</td>
                                    <td className='min-w-[90px]'><span className='text-lg font-semibold'>{book.copies}</span> pice</td>
                                    <td className='min-w-[90px]'><span className={`px-3 py-1 rounded-full text-xs font-medium ${book.available
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}>{book.available ? 'Available' : 'Unavailable'}</span></td>
                                    <td className='min-w-[120px]'><span className='bg-blue-300 px-2 py-1 rounded-sm text-base'>{book.genre.toLowerCase()}</span></td>
                                    <td className='min-w-[60px] justify-end gap-x-3 flex items-center'>
                                        {
                                            book.available ? <GiCardPickup onClick={() => handleBorrowModal(book._id)} className='border cursor-pointer border-transparent transition-all hover:border hover:border-green-500 px-1 md:px-2 lg:px-3 py-1 rounded-md text-[35px] md:text-[40px] lg:text-[50px]' /> :
                                                <GiCardPickup className='  border border-transparent transition-all text-slate-400 hover:cursor-not-allowed px-1 md:px-2 lg:px-3 py-1 rounded-md text-[35px] md:text-[40px] lg:text-[50px]' />
                                        }
                                        <FaRegEdit onClick={() => handleEditModal(book._id)} className='border cursor-pointer border-transparent transition-all hover:border hover:border-blue-500 px-1 md:px-2 lg:px-3 py-1 rounded-md text-[35px] md:text-[40px] lg:text-[50px]' />
                                        {
                                            loading.deleteLoading === true && deleteBookId === book._id ? <div className="w-[35px] md:w-[40px] lg:w-[50px] h-[35px] md:h-[40px] lg:h-[50px] flex items-center justify-center">
                                                <span className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full"></span>
                                            </div> :
                                                <MdOutlineDelete onClick={() => handleDelete(book._id)} className='border border-transparent transition-all hover:border hover:border-red-500 px-1 md:px-2 lg:px-3 py-1 rounded-md text-[35px] md:text-[40px] lg:text-[50px]' />
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* // update Modal */}
            <div>
                <Dialog key={'updateModal'} open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
                    {
                        data?.data?.map((book: TBook) => book._id === editId && (
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Update book</DialogTitle>
                                </DialogHeader>
                                <div>

                                    <form onSubmit={handleUpdateSubmit(handleUpdate)}>
                                        <p>{editId}, {book.title}</p>
                                        {/* register your input into the hook by invoking the "register" function */}
                                        <Input className="border-2 rounded-md focus:border-blue-500 px-2 w-full py-2" defaultValue={book.title} placeholder="Book Title" {...updateRegister("title", { required: true })} />
                                        {updateErrors.title && <span className="text-red-500 mb-2 text-sm">Title field is required</span>}

                                        <input className="border-2 mt-2 rounded-md focus:border-blue-500 px-2 w-full py-2" defaultValue={book.author} placeholder="Book Title" {...updateRegister("author", { required: true })} />
                                        {updateErrors.author && <span className="text-red-500 mb-2 text-sm">Author field is required</span>}

                                        <input className="border-2 mt-2 rounded-md focus:border-blue-500 px-2 w-full py-2" defaultValue={book.isbn} placeholder="ISBN Number" {...updateRegister("isbn", { required: true })} />
                                        {updateErrors.isbn && <span className="text-red-500 mb-2 text-sm">ISBN Number is required</span>}

                                        <select className="border-2 mt-2 rounded-md focus:border-blue-500 px-2 w-full py-2" defaultValue={book.genre} title="Please Select Book Genre" {...updateRegister("genre", { required: true })}>
                                            <option value="FICTION">Fiction</option>
                                            <option value="NON_FICTION">Non Fiction</option>
                                            <option value="SCIENCE">Science</option>
                                            <option value="HISTORY">History</option>
                                            <option value="BIOGRAPHY">Biography</option>
                                            <option value="FANTASY">Fantasy</option>
                                        </select>

                                        <select className="border-2 mt-2 rounded-md focus:border-blue-500 px-2 w-full py-2" defaultValue={book.available ? 'true' : 'false'} title="Please Select Available Book " {...updateRegister("available", { required: true })}>
                                            <option value="true">Available</option>
                                            <option value="false">Stock out </option>
                                        </select>

                                        <input className="border-2 mt-2 rounded-md focus:border-blue-500 px-2 w-full py-2" defaultValue={book.copies} type="Number" min={0} placeholder="Copies" {...updateRegister("copies", { required: true })} />
                                        {updateErrors.isbn && <span className="text-red-500 mb-2 text-sm">Copies field is required</span>}

                                        <textarea placeholder="Book Description" className="border-2 mt-2 mb-0 rounded-md focus:border-blue-500 px-2 w-full py-2" defaultValue={book.description} {...updateRegister("description", { required: true })}></textarea>
                                        {updateErrors.description && <span className="text-red-500 mt-0 text-sm">Description field is required</span>}

                                        <div className=" flex gap-x-3 mt-3">
                                            <DialogClose asChild>
                                                <Button onClick={() => setEditId('')} className="btn border-none ">Cancel</Button>
                                            </DialogClose>
                                            {
                                                loading.editLoading === true ?
                                                    <>
                                                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                                        Loading...
                                                    </>
                                                    :
                                                    <Button type="submit" className="btn border-none bg-blue-500 text-white hover:bg-blue-600">Update Book</Button>
                                            }
                                        </div>
                                    </form>

                                </div>
                            </DialogContent>
                        ))}
                </Dialog>
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

export default AllBooks;