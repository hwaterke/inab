import React, {Fragment} from 'react'
import {ResourceFormProvider, TransactionResource} from '@inab/shared'
import {crudThunks} from '../../../thunks/crudThunks'
import {DatePickerIOS, Keyboard} from 'react-native'
import {Banner} from '../../Banner'
import {Field, Form} from 'react-final-form'
import styled from 'styled-components'
import {Button} from '../../atoms/Button'
import {colors} from '../../../constants/colors'
import {DateTime} from 'luxon'

const Screen = styled.ScrollView`
  margin: 24px;
`

const Input = styled.TextInput`
  height: 40px;
  border-width: 1px;
`

const Row = styled.View`
  flex-direction: row;
`

const SignButton = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  align-items: center;
`

const IncomeText = styled.Text`
  color: ${colors.green};
`

const OutcomeText = styled.Text`
  color: ${colors.red};
`

const KDS = styled.TouchableWithoutFeedback`
  border-width: 1px;
  border-color: blue;
  background-color: blue;
`

function resourceToForm(v) {
  return {
    amount: {
      amount: 0,
      isOutcome: true,
    },
    ...v,
  }
}

export class TransactionAddScreen extends React.Component {
  render() {
    return (
      <KDS onPress={Keyboard.dismiss}>
        <ResourceFormProvider
          crudThunks={crudThunks}
          resource={TransactionResource}
          resourceToForm={resourceToForm}
        >
          {({onSubmit, isCreate, isUpdate, deleteResource, initialValues}) => (
            <Fragment>
              <Banner />

              <Form
                initialValues={{
                  date: new Date(),
                }}
                onSubmit={data => {
                  console.log({data})

                  onSubmit({
                    ...data,
                    amount: data.isIncome ? data.amount : -data.amount,
                    date: DateTime.fromJSDate(data.date).toISODate(),
                    type: 'regular'
                  })
                }}
              >
                {({handleSubmit}) => (
                  <Screen>
                    <Field name="isIncome">
                      {({input: {value, onChange}}) => (
                        <Row>
                          <SignButton onPress={() => onChange(true)}>
                            <IncomeText>Income</IncomeText>
                          </SignButton>
                          <SignButton onPress={() => onChange(false)}>
                            <OutcomeText>Outcome</OutcomeText>
                          </SignButton>
                        </Row>
                      )}
                    </Field>

                    <Field name="amount">
                      {({input: {value, onChange}}) => (
                        <Input
                          value={value}
                          onChange={onChange}
                          keyboardType="numeric"
                        />
                      )}
                    </Field>

                    <Field name="date">
                      {({input: {value, onChange}}) => (
                        <DatePickerIOS
                          date={value}
                          onDateChange={onChange}
                          mode="date"
                        />
                      )}
                    </Field>

                    <Button onPress={handleSubmit}>Save</Button>
                  </Screen>
                )}
              </Form>
            </Fragment>
          )}
        </ResourceFormProvider>
      </KDS>
    )
  }
}
