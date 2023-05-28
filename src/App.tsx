import { useEffect, useState } from 'react';
import * as C from './App.styles'

import logoImage from './assets/devmemory_logo.png'
import RestarIcon from './svgs/restart.svg'

import { InfoItem } from './components/infoItem';
import { GridItem } from './components/GridItems';
import { Button } from './components/Button';

import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';


const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCount, setShowCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  //* verificar se os ABERTOS são iguais
  useEffect(() => {
    if(showCount === 2) {
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2) {

        //* Verificação 1 - se eles são iguais, torna-los permanentes
        if(opened[0].item === opened[1].item) {
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid) {
            if(tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShowCount(0);
        } else {
          //* Verificação 2 - Se são diferente, feche todos os "shown"
          setTimeout(() => {
            let tmpGrid = [...gridItems];
            for(let i in tmpGrid) { 
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShowCount(0);
          }, 1500);
        }
        setMoveCount(moveCount => moveCount + 1);
      }
    }
  }, [showCount, gridItems]);

  //* Verificar se o jogo acabou
  useEffect(() => {
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false)
    }
  }, [moveCount, gridItems]);

  const resetAndCreateGrid = () => {
    //* Passo 1 - resetar o jogo
    setTimeElapsed(0);
    setMoveCount(0);
    setShowCount(0);

    //* passo 2 - Criar o grid e começar o jogo
    //* 2.1 - Criar um grid vazio
    let tmpGrid: GridItemType[] = [];
    for (let i = 0; i < (items.length * 2); i++) {
      tmpGrid.push({
        item: null,
        shown: false,
        permanentShown: false
      });
    }
    //* passo 2.2 - preencher o grid
    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let pos = -1;
        while (pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }

        tmpGrid[pos].item = i;
      }
    }

    //* passo 2.3 - jogar no state
    setGridItems(tmpGrid);

    //* passo 3 - Começar o jogo
    setPlaying(true);
  }

  const handleItemClick = (index: number) => {
    if(playing && index !== null && showCount < 2) {
      let tmpGrid = [...gridItems];
      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShowCount(showCount + 1)
      }
      setGridItems(tmpGrid)
    }
  }

  return (
    <C.container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt="" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Movimentos" value={moveCount.toString()} />
        </C.InfoArea>

        <Button label='Reiniciar' icon={RestarIcon} onClick={resetAndCreateGrid} />
      </C.Info>

      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem
              key={index}
              item={item}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.container>
  );
}

export default App;