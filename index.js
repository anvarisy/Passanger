const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
})
var model = []
var seats = [];
var designs = [];
var aisle = []
var window = [] 
var middle = [];
var p_seats = []
var arrQueue = []
readline.question('Input seat model of the airplane example:  3,2 4,3 2,3 3,4 \n',(format)=>{
    readline.question('Input total of the passanger in the queue!\n', (queue)=>{
      console.log("-------------Processing Seats Design---------------------")
      arrQueue = Array.from({length: queue}, (_, i) => i + 1)
      model = format.split(' ')
      //Create steas model
      for(let i=0; i<model.length; i++){
        let s = model[i].split(",")
        s = new Size(s[0], s[1])
        seats.push(s)
      }
      //Create design
      for(let i=0; i<seats.length; i++){
        for(let j=1; j<=seats[i].column; j++){
          for(let k=1; k<=seats[i].row; k++){
            if((i==0 && j==1) || (i==seats.length-1 && j==seats[i].column)){
              let c = new Coordinate(j,k,i+1,POSITION.WINDOW)
              window.push(c)
            } 
            else if(j==1||j==seats[i].column){
              let c = new Coordinate(j,k,i+1,POSITION.AISLE)
              aisle.push(c)
            }else{
              let c = new Coordinate(j,k,i+1,POSITION.MIDDLE)
              middle.push(c)
            }
          }
        }
      }
      let a_sort = aisle.sort(compare)
      a_sort.forEach(element => {
        designs.push(element)
      });

      let w_sort = window.sort(compare)
      w_sort.forEach(element => {
        designs.push(element)
      });

      let m_sort = middle.sort(compare)
      m_sort.forEach(element => {
        designs.push(element)
      });
      if(designs.length< arrQueue.length){
        console.log("-------------Overload passanger---------------------")
        readline.close()
        return
        
      }
      console.log(designs)
      console.log("-------------Processing Seats Queue---------------------")
      for(let p = 0; p<designs.length; p++){
          if(arrQueue[p]!=null){
            passanger = new PassangerSeat(arrQueue[p], designs[p])
            p_seats.push(passanger)
          }else{
            passanger = new PassangerSeat('x', designs[p])
            p_seats.push(passanger)
          }
      }

      console.log(p_seats)
      console.log("-------------Processing View---------------------")
      let condition = true;
      let currentRow = 1;
      let groupColumn= []
      let isGroupColumnAsign = false;
      while(condition){
          var array = []
          p_seats.forEach(element => {
            if(element.seat.row==currentRow){
              array.push(element)
            }
          });
          if(array.length==0){
            condition = false
          }else{
            array.sort(sortingforView)
            if(!isGroupColumnAsign){
              isGroupColumnAsign = true
              let cGroup = 0
              array.forEach(item => {
                if(item.seat.group>cGroup){
                  groupColumn.push(1)
                  cGroup++
                }else{
                  groupColumn[cGroup-1]++
                }
              });
            }
            let temp = ""
            for (let iGroup = 0; iGroup < groupColumn.length; iGroup++) {
              const element = groupColumn[iGroup]
              for (let iColumn = 0; iColumn < element; iColumn++) {
                const column = iColumn+1;
                const item = array.filter(v=>{
                  if(v.seat.group==iGroup+1 && v.seat.column==column){
                    return true
                  }
                  return false
                })[0]
                if(item==null || item.no==null){
                  temp = temp.concat(`   `)
                }else{
                  temp = temp.concat(`${(item.no.toString().length==1)?` ${item.no} `:`${item.no} `}`)
                  // temp = temp.concat(`${(item.no!=null)?item.no:"x"} `)
                }
                
              }
              temp = temp.concat(`\t`)
            }
            // let currentGroup = 1;
            // array.forEach(e => {
            //   var min = parseInt(e.seat.group) - currentGroup
            //   if(currentGroup!=e.seat.group){
            //     for(let a = 0; a<min; a++){
            //       temp = temp.concat(`\t`)
            //     }
            //     currentGroup+=min
            //   }
            //   temp = temp.concat(`${(e.no!=null)?e.no:"x"} `)
            // });
            console.log(temp)
          }
          currentRow+=1
      }
      readline.close()
    })
})
readline.on("close", function() {
  console.log("\nBYE BYE !!!");
  process.exit(0);
});


class PassangerSeat{
  constructor(n, s){
    this.no = n;
    this.seat = s
  }

  columnValue(){
    let group = this.seat.group
    let column = this.seat.column
    return parseFloat(`${group}.${column}`)
  }
}

class Size{
  constructor(x, y){
      this.column=parseInt(x);
      this.row=parseInt(y);
  }

  total() {
    return this.column * this.row
  }
}

class Coordinate{
  constructor(x, y, z, position){
    this.group = parseInt(z);
    this.column = parseInt(x);
    this.row = parseInt(y);
    this.position = position;
  }
}

const POSITION = {
	AISLE: "aisle",
	WINDOW: "window",
	MIDDLE: "middle"
}

function compare( a, b ) {
  if ( a.row < b.row ){
    return -1;
  }
  if ( a.row > b.row ){
    return 1;
  }
  return 0;
}

function sortingforView(a, b){
  if(a.columnValue() < b.columnValue()){
    return -1;
  }
  if ( a.columnValue() > b.columnValue()){
    return 1;
  }
  return 0;

}