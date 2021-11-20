const getCsvBtn = document.querySelector('.period-form__submit')

const beginPeriodInput = document.querySelector('.period-form__begin')
const endPeriodInput = document.querySelector('.period-form__end')

let csvContent = "data:text/csv;charset=utf-8,"

const getCsvHandler = () => 
{
    if((beginPeriodInput.value === '') || (endPeriodInput.value === ''))
    {
        alert('период нада')
    }
    else 
    {        
        getToken().then(res => 
            {
                beginDate = new Date(beginPeriodInput.value)
                endDate = new Date(endPeriodInput.value)
                beginDate.setHours(0, 0, 0, 0)
                endDate.setHours(24, 0, 0, 0)                
                recursionFetch(res.data.access_token, beginDate, endDate);
            })
        
    }
}

getCsvBtn.addEventListener('click', getCsvHandler)

function recursionFetch(token, beginDate, endDate, lastId = '', lastTime = '') {
    const params = {
      fromId: lastId,
      fromSortingField: lastTime,
      sortingField: '',
      search: '',
      parentGroupIds: '',
      categoryFilter: '',
      begin: beginDate,
      end: endDate,
      withoutTransitions: true
  }
  fetchData(params, token).then(resp => 
    {      
      createCSV(resp.data.products)
      if(resp.data.products.length >= 50){
        recursionFetch(token, beginDate, endDate, resp.data.products[49].id, resp.data.products[49].createdDate)
      }
      else {
          var link = document.createElement("a");
          link.setAttribute("href", csvContent);
          link.setAttribute("download", "выгрузка.csv");
          document.body.appendChild(link); 
          link.click();
      }
    })
}


const getToken = async () =>
{
    const authData = new FormData();
    authData.append('scope', 'read write')
    authData.append('grant_type', 'password')
    authData.append('username', '+79233151357')
    authData.append('password', '123456')

    try {
        let options = {
          url: 'https://api-s07.sigma.ru/oauth/token',
          method: 'post',
          headers: {
                'Authorization': 'Basic ' + 'cWFzbGFwcDpteVNlY3JldE9BdXRoU2VjcmV0'
            },
          data: authData
        }    
        return await axios(options)
      }
      catch (error) {
        if (error.response && error.response.data) {
          const { data = {}, statusText } = error.response
          const { errors = '' } = data
          error.message = errors ? errors : statusText
        }
        throw error
      }
}

const fetchData = async (params, token) => {
    try {
      let options = {
        url: 'https://api-s07.sigma.ru/rest/v5/companies/4c6d76ec-3eb6-4c14-a784-30d0db4540f6/products/transitions',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + token
          },
        params
      }
  
      return await axios(options)
    }
    catch (error) {
      if (error.response && error.response.data) {
        const { data = {}, statusText } = error.response
        const { errors = '' } = data
        error.message = errors ? errors : statusText
      }
      throw error
    }
  }

function createCSV (products){        
    products.forEach(
        item => 
        {              
          let newName = item.name.replace('#', '№')
          csvContent = csvContent + newName + ';' + item.unitName + ';' + item.quantityStart + ';' + item.amountStart + ';' + item.income + ';' + item.amountIncome + ';' + item.outcome + ';' + item.amountOutcome + ';' + item.quantityEnd + ';' + item.amountEnd + '\n'
        }
    );
}

    //     function renderProductTable (data) 
//     {
//         data.forEach((item) => 
//         {
//             table.insertAdjacentHTML('beforeend', `<tr>
//                                                         <td>${item.name}</td>
//                                                         <td>${item.unitName}</td>
//                                                         <td>${item.quantityStart}</td>
//                                                         <td>${item.amountStart}</td>
//                                                         <td>${item.income}</td>
//                                                         <td>${item.amountIncome}</td>
//                                                         <td>${item.outcome}</td>
//                                                         <td>${item.amountOutcome}</td>
//                                                         <td>${item.quantityEnd}</td>
//                                                         <td>${item.amountEnd}</td>
//                                                     </tr>`)
//         }) 
//     }