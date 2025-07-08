
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateBookMutation } from "@/Redux/baseApi/baseApi";
import { useState } from "react";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

const CreateNewBook = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [createBook] = useCreateBookMutation()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setLoading(true)
        const payload = {
            ...data,
            available: data.available === 'true' ? true : false
        }
        try {
            const res = await createBook(payload)
            console.log(res);
            if (res?.data?.success) {
                setLoading(false)
                setOpen(false)
                reset()
                return toast.success(res?.data?.message)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <form>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">Add Book</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create a new book</DialogTitle>
                        </DialogHeader>
                        <div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* register your input into the hook by invoking the "register" function */}
                                <input className="border-2 rounded-md focus:border-blue-500 px-2 w-full py-2" placeholder="Book Title" {...register("title", { required: true })} />
                                {errors.title && <span className="text-red-500 mb-2 text-sm">Title field is required</span>}

                                <input className="border-2 mt-2 rounded-md focus:border-blue-500 px-2 w-full py-2" placeholder="Author Name" {...register("author", { required: true })} />
                                {errors.author && <span className="text-red-500 mb-2 text-sm">Author field is required</span>}

                                <input className="border-2 mt-2 rounded-md focus:border-blue-500 px-2 w-full py-2" placeholder="ISBN Number" {...register("isbn", { required: true })} />
                                {errors.isbn && <span className="text-red-500 mb-2 text-sm">ISBN Number is required</span>}

                                <select className="border-2 mt-2 rounded-md focus:border-blue-500 px-2 w-full py-2" title="Please Select Book Genre" {...register("genre", { required: true })}>
                                    <option value="FICTION">Fiction</option>
                                    <option value="NON_FICTION">Non Fiction</option>
                                    <option value="SCIENCE">Science</option>
                                    <option value="HISTORY">History</option>
                                    <option value="BIOGRAPHY">Biography</option>
                                    <option value="FANTASY">Fantasy</option>
                                </select>
                                <select className="border-2 mt-2 rounded-md focus:border-blue-500 px-2 w-full py-2" title="Please Select Available Book " {...register("available", { required: true })}>
                                    <option value="true">Available</option>
                                    <option value="false">Stock out </option>
                                </select>

                                <input className="border-2 mt-2 rounded-md focus:border-blue-500 px-2 w-full py-2" type="Number" min={1} placeholder="Copies" {...register("copies", { required: true })} />
                                {errors.isbn && <span className="text-red-500 mb-2 text-sm">Copies field is required</span>}

                                <textarea placeholder="Book Description" className="border-2 mt-2 mb-0 rounded-md focus:border-blue-500 px-2 w-full py-2" {...register("description", { required: true })}></textarea>
                                {errors.description && <span className="text-red-500 mt-0 text-sm">Description field is required</span>}

                                <div className=" flex gap-x-3 mt-3">
                                    <DialogClose asChild>
                                        <Button className="btn border-none ">Cancel</Button>
                                    </DialogClose>
                                    {
                                        loading === true ?
                                            <>
                                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                                Loading...
                                            </>
                                            :
                                            <Button type="submit" className="btn border-none bg-blue-500 text-white hover:bg-blue-600">Create Book</Button>
                                    }
                                </div>
                            </form>
                        </div>
                    </DialogContent>
                </form>
            </Dialog>
        </div>
    );
};

export default CreateNewBook;