import {Alert, AlertDescription, AlertIcon, AlertTitle} from "@chakra-ui/alert"
import {AlertType, alertService} from "../services"
import {Box, CloseButton, Fade} from "@chakra-ui/react"
import {useEffect, useState} from "react"

import PropTypes from "prop-types"
import {string} from "yup"
import {useRouter} from "next/router"

export {AlertStack}

AlertStack.propTypes = {
  id: PropTypes.string,
  fade: PropTypes.bool,
  message: string
}

AlertStack.defaultProps = {
  id: "default-alert",
  fade: true,
  message: ""
}

function AlertStack({id, fade}) {
  const router = useRouter()
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // subscribe to new alert notifications
    const subscription = alertService.onAlert(id).subscribe((alert) => {
      // clear alerts when an empty alert is received
      if (!alert.message) {
        setAlerts((alerts) => {
          // filter out alerts without 'keepAfterRouteChange' flag
          const filteredAlerts = alerts.filter((x) => x.keepAfterRouteChange)

          // remove 'keepAfterRouteChange' flag on the rest
          filteredAlerts.forEach((x) => delete x.keepAfterRouteChange)
          return filteredAlerts
        })
      } else {
        // add alert to array
        setAlerts((alerts) => [...alerts, alert])

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => removeAlert(alert), 3000)
        }
      }
    })

    // clear alerts on location change
    const onRouteChange = () => alertService.clear(id)
    router.events.on("routeChangeStart", onRouteChange)

    // clean up function that runs when the component unmounts
    return () => {
      // unsubscribe to avoid memory leaks
      subscription.unsubscribe()
      router.events.off("routeChangeStart", onRouteChange)
    }
  }, [])

  function removeAlert(alert) {
    if (fade) {
      // fade out alert
      const alertWithFade = {...alert, fade: true}
      setAlerts((alerts) =>
        alerts.map((x) => (x === alert ? alertWithFade : x))
      )

      // remove alert after faded out
      setTimeout(() => {
        setAlerts((alerts) => alerts.filter((x) => x !== alertWithFade))
      }, 250)
    } else {
      // remove alert
      setAlerts((alerts) => alerts.filter((x) => x !== alert))
    }
  }

  if (!alerts.length) return null

  return (
    <>
      {alerts.map((alert, index) => (
        <Alert key={index} status="info">
          <AlertIcon />
          <Box>
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              <span dangerouslySetInnerHTML={{__html: alert.message}}></span>
            </AlertDescription>
          </Box>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={() => removeAlert(alert)}
          />
        </Alert>
      ))}
    </>
  )
}
