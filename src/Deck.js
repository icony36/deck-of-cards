import React, {Component} from 'react';
import axios from 'axios';
import Card from './Card';
import './Deck.css';
const API = "https://deckofcardsapi.com/api/deck";

class Deck extends Component {
    constructor(props){
        super(props);
        this.state ={
            deck: null,
            drawn: [],
            noCard: false,
            isLoaded: true
        }
        this.handleDraw = this.handleDraw.bind(this);
        this.shuffle = this.shuffle.bind(this);
    }

    componentDidMount(){
        this.shuffle();
    }
   
    async shuffle(){
        this.setState({ 
            deck: null,
            drawn: [],
            noCard: false
        })
        this.setState({isLoaded: false})
            let res = await axios.get(`${API}/new/shuffle/?deck_count=1`);
            this.setState({deck: res.data, isLoaded: true})

    }

    async handleDraw(){
        try {
            this.setState({isLoaded: false}) 
            let cardRes = await axios.get(`${API}/${this.state.deck.deck_id}/draw/?count=1`);
    
                if(!cardRes.data.success){
                    this.setState({noCard: true});
                    throw Error("no more cards");
                } else {
                    let cardDetails = cardRes.data.cards[0]
                    this.setState(st=>{
                        return {drawn: [...st.drawn, {
                            id: cardDetails.code,
                            image: cardDetails.image,
                            name: `${cardDetails.value} of ${cardDetails.suit}`
                        }], isLoaded: true}
                    })
                }

        } catch(err) {
            console.log(err);
            this.setState({isLoaded: true})
        }
       
    }


    render(){

        let subtitle;
        if(this.state.noCard){
           subtitle = `No Card Remaining!`;
        } else if (this.state.drawn.length > 0){
            subtitle = `Card remaining: ${52-this.state.drawn.length}`;
        } else {
            subtitle = `Let's draw a card!`;                    
        }

        let drawnCard = this.state.drawn.map(el=>(
            <Card 
            key={el.id}
            image={el.image}
            name={el.name}
            />
        ))
      
        return(
            <div>
                <h1 className="Deck-title">♦ Card Dealer ♦</h1>
                <div className='Deck'>
                    <h2 className='Deck-title subtitle'>{subtitle}</h2>   
                </div>
                <button className='Deck-btn' onClick={this.handleDraw} disabled={!this.state.isLoaded}>Draw</button>
                <button className='Deck-btn' onClick={this.shuffle}>Shuffle</button>
                <div className='Deck-cardarea'>{drawnCard}</div>
                
                {!this.state.isLoaded &&
                    (<div className="loader">
                    </div>
                    )
                }
            </div>
        )       
    }
}

export default Deck;