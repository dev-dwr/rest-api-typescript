import { useForm } from "react-hook-form";

function RegisterPage() {
    const {register} = useForm()
  return (
    <>
      <form>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="jane.bum@gmail.com" {...register('email')} />
        </div>
      </form>
    </>
  );
}

export default RegisterPage;
