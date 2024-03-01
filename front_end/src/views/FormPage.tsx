import { useState } from 'react'
import '../styles/FormPage.css';
import { useQuery } from '@tanstack/react-query'

function FormPage() {
    const [count, setCount] = useState(0)
    const [UrsName, setUrsName] = useState('');
    const [UrsNeed, setUrsNeed] = useState('');
    const [UrsDetails, setUrsDetails] = useState('');
    const [ProcessType, setProcessType] = useState('');
    const [ProcessTypeLevel1, setProcessTypeLevel1] = useState('');
    const [ProcessTypeLevel2, setProcessTypeLevel2] = useState('');
    const [StateAvancement, setStateAvancement] = useState('');
    const [StateAvancementCriticite, setStateAvancementCriticite] = useState('');
    const [CriticiteClient, setCriticiteClient] = useState(true);
    const [CriticiteVsi, setCriticiteVsi] = useState(true);

    const [formSquareSizeForm1, setFormSquareSizeForm1] = useState({ width: '75%', height: '60%' });

    return (
        <>

            <div className="rectangle-230">
            <div className='form-title'>
                    Nom de l'URSSSSSS
                </div>
                <div className='form-square-URS'>
                    <div>
                        <label htmlFor="UrsName" style={{ color: 'black', font: 'Source Sans Pro', textAlign: 'center', position: 'absolute', left: '4.31%', top: '2%' }}>Nom de l'URS :</label>
                        <input
                            id="UrsName"
                            className="rectangle-form"
                            style={{ left: '4.31%', right: '21.19%', top: '7%', bottom: '95.09%', color: 'black' }}
                            value={UrsName}
                            onChange={(e) => setUrsName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="UrsNeed" style={{ color: 'black', font: 'Source Sans Pro', textAlign: 'center', position: 'absolute', left: '53.31%', top: '2%' }}>Type de besoin :</label>
                        <input
                            id="UrsNeed"
                            className="rectangle-form"
                            style={{ left: '53.31%', right: '5.31%', top: '7%', bottom: '95.09%', color: 'black', fontFamily: 'Arial', textAlign: 'center' }}
                            value={UrsNeed}
                            onChange={(e) => setUrsNeed(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="UrsDetails" style={{ color: 'black', font: 'Source Sans Pro', textAlign: 'center', position: 'absolute', left: '4.31%', top: '25%' }}>Description détaillée de l'URS :</label>
                        <input
                            id="UrsDetails"
                            className="rectangle-form-big"
                            style={{ left: '4.31%', right: '5.31%', top: '30%', bottom: '95.09%', color: 'black', fontFamily: 'Arial', textAlign: 'center' }}
                            value={UrsDetails}
                            onChange={(e) => setUrsDetails(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="ProcessType" style={{ color: 'black', font: 'Source Sans Pro', textAlign: 'center', position: 'absolute', left: '4.31%', top: '63%' }}>Process type :</label>
                        <input
                            id="ProcessType"
                            className="rectangle-form"
                            style={{ left: '4.31%', right: '21.19%', top: '68%', bottom: '95.09%', color: 'black', fontFamily: 'Arial', textAlign: 'center' }}
                            value={ProcessType}
                            onChange={(e) => setProcessType(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="ProcessTypeLevel1" style={{ color: 'black', font: 'Source Sans Pro', textAlign: 'center', position: 'absolute', left: '53.31%', top: '63%' }}>Process step level 1 :</label>
                        <input
                            id="ProcessTypeLevel1"
                            className="rectangle-form"
                            style={{ left: '53.31%', right: '5.31%', top: '68%', bottom: '95.09%', color: 'black', fontFamily: 'Arial', textAlign: 'center' }}
                            value={ProcessTypeLevel1}
                            onChange={(e) => setProcessTypeLevel1(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="ProcessTypeLevel2" style={{ color: 'black', font: 'Source Sans Pro', textAlign: 'center', position: 'absolute', left: '4.31%', top: '80%' }}>Process step level 2 :</label>
                        <input
                            id="ProcessTypeLevel2"
                            className="rectangle-form"
                            style={{ left: '4.31%', right: '21.19%', top: '85%', bottom: '95.09%', color: 'black', fontFamily: 'Arial', textAlign: 'center' }}
                            value={ProcessTypeLevel2}
                            onChange={(e) => setProcessTypeLevel2(e.target.value)}
                        />
                    </div>
                </div>

                <div className='form-square-level1'>
                    <div>
                        <label htmlFor="UrsStatut" style={{ color: 'black', font: 'Source Sans Pro', textAlign: 'center', position: 'absolute', left: '4.31%', top: '4%' }}>Statut de l'avancement :</label>
                        <select
                            id="UrsStatut"
                            className="rectangle-form"
                            style={{ left: '4.31%', right: '21.19%', top: '14%', bottom: '95.09%', color: 'black' }}
                            value={StateAvancement}
                            onChange={(e) => setStateAvancement(e.target.value)}
                        >
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    </div>
                </div>

                <div className='form-square-level2'>
                    <div>
                        <label htmlFor="UrsStatut" style={{ color: 'black', font: 'Source Sans Pro', textAlign: 'center', position: 'absolute', left: '4.31%', top: '4%' }}>Statut de l'avancement :</label>
                        <select
                            id="UrsStatut"
                            className="rectangle-form"
                            style={{ left: '4.31%', right: '21.19%', top: '14%', bottom: '95.09%', color: 'black' }}
                            value={StateAvancementCriticite}
                            onChange={(e) => setStateAvancementCriticite(e.target.value)}
                        >
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="CriticiteClient" style={{ color: 'black', font: 'Source Sans Pro', textAlign: 'center', position: 'absolute', left: '4.31%', top: '40%' }}>Criticité client :</label>
                        <select
                            id="CriticiteClient"
                            className="rectangle-form"
                            style={{ left: '4.31%', right: '21.19%', top: '50%', bottom: '95.09%', color: 'black' }}
                            value={CriticiteClient.toString()}
                            onChange={(e) => setCriticiteClient(e.target.value === 'true')}
                        >
                            <option value="true">Oui</option>
                            <option value="false">Non</option>

                        </select>
                    </div>
                    <div>
                        <label htmlFor="CriticiteVsi" style={{ color: 'black', font: 'Source Sans Pro', textAlign: 'center', position: 'absolute', left: '53.31%', top: '40%' }}>Criticité VSI :</label>
                        <select
                            id="CriticiteVsi"
                            className="rectangle-form"
                            style={{ left: '53.31%', right: '21.19%', top: '50%', bottom: '95.09%', color: 'black' }}
                            value={CriticiteVsi.toString()}
                            onChange={(e) => setCriticiteVsi(e.target.value === 'true')}
                        >
                            <option value="true">Oui</option>
                            <option value="false">Non</option>
                        </select>
                    </div>


                </div>

            </div>

            <div className="rectangle-228"></div>


        </>
    )
}

export default FormPage;
