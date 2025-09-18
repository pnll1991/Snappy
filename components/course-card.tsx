"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Calendar, Award, ImageIcon } from "lucide-react"
import type { Course } from "@/app/admin/actions"
import { CachedContentImage } from "@/components/cached-image"

type Props = {
  course: Course
  ctaLabel?: string
}

export default function CourseCard({ course, ctaLabel = "Ver programa" }: Props) {
  return (
    <Card className="flex flex-col overflow-hidden glass-card">
      <div className="relative w-full aspect-square">
        {course.image ? (
          <CachedContentImage
            src={course.image}
            alt={course.title}
            aspectRatio="aspect-square"
            className="rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted rounded-t-lg">
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="heading-5">{course.title}</CardTitle>
        <CardDescription className="body-base">{course.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Duración: {course.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Modalidad: {course.modality}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Award className="h-4 w-4" />
          <span>Certificación: {course.certification}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center pt-6">
        <Button asChild size="lg" variant="glass" className="font-accent">
          <Link href={course.slug ? `/cursos/${course.slug}` : "#"}>{ctaLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
