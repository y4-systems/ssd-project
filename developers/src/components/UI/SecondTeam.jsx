import React from 'react'
import '../../styles/team.css'
// import team01 from '../../images/team-01.png'
import team01 from '../../images/team-02.jpg'
import team02 from '../../images/team-03.png'
import team03 from '../../images/avatar.jpg'
import team04 from '../../images/team-04.png'




const teamlast4Members = [
    
    {
        imgUrl: team01,
        name: 'Sunera Weerakkody',
        position: 'Frontend Developer'
    },

    {
        imgUrl: team02,
        name: 'Dilsha De Silva',
        position: 'Backend Developer'
    },

    {
        imgUrl: team03,
        name: 'Seneru Nethum',
        position: 'Full Stack Developer'
    },

    {
        imgUrl: team04,
        name: 'Amandi',
        position: 'DevOps Engineer'
    }
]

const SecondTeam = () => {
    return (
        <section className='our__team'>
            <div className='container'>
                {/* <div className='team__content'>
                    <h6 className='subtitle'>Our Team</h6>
                    <h2>
                        Join With <span className='highlight'>Our Team</span>
                    </h2>
                </div> */}
                <div className='team__wrapper'>
                    {
                        teamlast4Members.map((item, index) => (
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




export default SecondTeam