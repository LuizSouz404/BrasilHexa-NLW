import { FlatList, Icon, useToast, VStack } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";

import { Octicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from 'react';
import { EmptyPoolList } from "../components/EmptyPoolList";
import { Loading } from "../components/Loading";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { api } from "../services/api";

export function Pools() {
  const [pools, setPools] = useState<PoolCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { navigate } = useNavigation();

  const toast = useToast();

  async function fetchPools() {
    try {
      setIsLoading(true);
      const response = await api.get('/pools');
      setPools(response.data.pools);
    } catch (error) {
      
      toast.show({
        title: 'Não foi possível carregar os bolões',
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPools();
  }, []));


  return(
    <VStack flex={1} bg="gray.900">
      <Header title="Meus bolões" />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button 
          title="BUSCAR BOLÃO POR CÒDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md"/>}
          onPress={() => navigate('find')}
        />
      </VStack>

      {isLoading ? <FlatList
        data={pools}
        keyExtractor={item => item.id}
        renderItem={({item}) => <PoolCard data={item} onPress={() => navigate('details', {id: item.id})}/>}
        px={5}
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{pb: 10}}
        ListEmptyComponent={() => <EmptyPoolList />}
      /> : <Loading />}

    </VStack>
  )
}