import {Plugin} from '../Plugin.ts'


export default class MiniGame extends Plugin {
    public events: any;
    public defaultScoreGames = [904, 905, 906, 912, 916, 917, 918, 919, 950, 952]
    constructor(users: any, rooms: any) {
        super(users, rooms)
        this.events = {
            'start_game': this.startGame,
            'send_move': this.sendMove,
            'game_over': this.gameOver
        }
    }

    startGame(args: any, user: any) {
        if (user.inWaddleGame) {
            user.waddle.startGame(user)
        }
    }

    sendMove(args: any, user: any) {
        if (user.inWaddleGame) {
            user.waddle.sendMove(args, user)
        }
    }

    gameOver(args: any, user: any) {
        if (!user.room.game) {
            return
        }

        let coins = this.getCoinsEarned(user, args.score)
        user.updateCoins(coins)

        user.send('game_over', { coins: user.data.coins })
    }

    getCoinsEarned(user: any, score: any) {
        if (user.inWaddleGame) {
            return user.waddle.getPayout(user, score)

        } else if (user.room.id in this.defaultScoreGames) {
            return score

        } else {
            return Math.ceil(score / 10)
        }
    }

}
