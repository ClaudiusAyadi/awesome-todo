import React from 'react';
import { Link } from 'react-router-dom';

function Signup() {
	return <div className='hero h-screen w-full text-white'>
			<header className='mx-auto max-w-7xl p-8'>
				<figure className='max-w-fit'>
					<Link to='/'>
						<picture>
							<img src='/vite.svg' alt='Netflix hero' className='w-40 object-cover' />
						</picture>
					</Link>
				</figure>
			</header>

			<main className='mx-auto mb-12 mt-20 max-w-xl px-[5%]'>
				<section className='min-h-96 w-full rounded-sm bg-black/70 p-12 shadow-md'>
				<h1 className='mb-4 text-4xl font-bold'>Sign in</h1>

				<form className='flex flex-col gap-4'>
					<div className='relative'>
						<input
							type='email'
							id='email'
							name='email'
							autoComplete='email'
							placeholder='Email'
							required
							className='peer mt-1 min-h-14 w-full rounded-[4px] border-2 border-gray-600 bg-transparent px-4 pb-2 pt-6 placeholder-transparent focus:outline-none focus:ring'
						/>
						<label
							htmlFor='email'
							className='absolute left-0 top-2 px-4 text-sm text-gray-400 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:px-4 peer-focus:text-sm'>
							Email
						</label>
					</div>

					<div className='relative'>
						<input
							type='password'
							id='password'
							name='password'
							autoComplete='password'
							placeholder='Password'
							required
							className='peer mt-1 min-h-14 w-full rounded-[4px] border-2 border-gray-600 bg-transparent px-4 pb-2 pt-6 placeholder-transparent focus:outline-none focus:ring'
						/>
						<label
							htmlFor='password'
							className='absolute left-0 top-2 px-4 text-sm text-gray-400 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:px-4 peer-focus:text-sm'>
							Password
						</label>
					</div>

					<div className='relative'>
						<input
							type='password'
							id='confirmPassword'
							name='confirmPassword'
							autoComplete='password'
							placeholder='Confirm Password'
							required
							className='peer mt-1 min-h-14 w-full rounded-[4px] border-2 border-gray-600 bg-transparent px-4 pb-2 pt-6 placeholder-transparent focus:outline-none focus:ring'
						/>
						<label
							htmlFor='confirmPassword'
							className='absolute left-0 top-2 px-4 text-sm text-gray-400 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:px-4 peer-focus:text-sm'>
							Confirm Password
						</label>
					</div>
					<button type='submit' className='min-h-10 rounded-[4px] bg-red-500'>
						Sign up
					</button>
				</form>
				</section>
		</main>
		</div>

}

export default Signup;
