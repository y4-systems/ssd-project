import React from 'react'
import '../../styles/team.css'
// import team01 from '../../images/team-01.png'
import team01 from '../../images/sadeesha.png'
import team02 from '../../images/ashika.png'
import team03 from '../../images/chamika.png'
import team04 from '../../images/janudi.png'


const teamfirst4Members = [
    {
        imgUrl: team01,
        name: 'Sadeesha Perera',
        position: 'Project Manager'
    },

    {
        imgUrl: team02,
        name: 'Ashika',
        position: 'QA Engineer'
    },

    {
        imgUrl: team03,
        name: 'Chamika Harshajith',
        position: 'UI/UX Designer'
    },

    {
        imgUrl: team04,
        name: 'Janudi Tharushika',
        position: 'Business Analyst'
    },

]


const FirstTeam = () => {
    return (
        <section className='our__team'>
            <div className='container'>
                <div className='team__content'>
                    <h6 className='subtitle'>Our Team</h6>
                    <h2>
                        Meet <span className='highlight'>Our Team</span>
                    </h2>
                </div>
                <div className='team__wrapper'>
                    {
                        teamfirst4Members.map((item, index) => (
                            <div className='team__item' key={index}>
                                <div className='team__img'>
                                    <img src={item.imgUrl} alt='' />
                                </div>
                                <div className='team__details'>
                                    <h4>{item.name}</h4>
                                    <p className='description'>{item.position}</p>

                                    <div className='team__member-social'>
                                        <span><i class='ri-linkedin-line'></i></span>
                                        <span><i class='ri-github-line'></i></span>
                                        <span><i class='ri-facebook-line'></i></span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}




export default FirstTeam