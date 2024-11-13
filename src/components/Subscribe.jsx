import React, {useState} from 'react'
import emailjs from 'emailjs-com'
import toast, { Toaster } from 'react-hot-toast'

const Subscribe = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = e => {
        e.preventDefault()

        emailjs
            .send(
                'service_go3dryt', //service ID (can hide in env file)
                'template_wdhkfje', //template ID (can hide in env file)
                formData,
                'V4ht9FX_1ca_ajZC9' // public api key (can hide in env file)
            )
            .then(
                (response) => {
                    toast.success('Successfully Subscribed', {
                        style: {
                          padding: '16px',
                          color: '#5D8F3F',
                        },
                      });
                    setFormData({name: '', email: '', subject: '', message: ''});
                },
                (error) => {
                    toast.error('Failed to send message. Please try again')
                }
            );
    };


  return (
    <div className='form-div'>
      <Toaster position='top-center'/>
      <h2>Subscribe to our Newsletter</h2>
      <p>Join and become a part of our month newsletter to keep upto date on all the latest news from Diabetes NZ</p>
      <form onSubmit={handleSubmit} className='form'>
        <label htmlFor='name'>Name:</label>
        <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                id='name'
                required
            />
        <label htmlFor='email'>Email:</label>
        <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                id='email'
                required
            />
        <button type='submit' className='primary-button'> Subscribe </button>
      </form>
    </div>
  )
}

export default Subscribe
