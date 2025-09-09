"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Clock, Calendar, Award, ImageIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Course } from "@/app/admin/actions"

type Props = {
  course: Course
  ctaLabel?: string
}

export default function CourseCard({ course, ctaLabel = "Ver programa" }: Props) {
  return (
    <Card className="flex flex-col overflow-hidden glass-card">
      <div className="relative w-full aspect-square">
        {course.image ? (
          <Image
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            fill
            className="object-cover rounded-md"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
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

        {course.professionals && course.professionals.length > 0 && (
          <div className="pt-2">
            <div className="heading-6 mb-2">Profesionales</div>
            <div className="flex -space-x-3">
              {course.professionals.slice(0, 5).map((professional, idx) => (
                <Avatar key={idx} className="w-10 h-10 ring-2 ring-background">
                  <AvatarImage src={professional.image || "/placeholder.svg"} alt={professional.name} />
                  <AvatarFallback>{professional.name?.substring(0, 2) || "PR"}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center pt-6">
        <Button asChild size="lg" variant="glass" className="font-accent">
          <Link href={course.slug ? `/cursos/${course.slug}` : "#"}>{ctaLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
