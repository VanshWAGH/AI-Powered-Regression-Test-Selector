"use client"

import { useEffect, useState } from "react"
import CountUp, { CountUpProps } from "react-countup"

interface AnimatedCounterProps extends Omit<CountUpProps, 'end'> {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2,
  ...props
}: AnimatedCounterProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <span>
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </span>
    )
  }

  return (
    <CountUp
      end={value}
      prefix={prefix}
      suffix={suffix}
      decimals={decimals}
      duration={duration}
      separator=","
      useEasing={true}
      {...props}
    />
  )
}
